import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDto, RolesResponseDto } from './dto/role-response.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getRoles(page = 1, limit = 10): Promise<RolesResponseDto> {
    const skip = (page - 1) * limit;

    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({
        skip,
        take: limit,
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
          users: {
            select: { id: true },
          },
        },
        orderBy: [
          { isSystem: 'desc' },
          { name: 'asc' },
        ],
      }),
      this.prisma.role.count(),
    ]);

    return {
      data: roles.map(this.formatRole),
      total,
      page,
      limit,
    };
  }

  async getRoleById(id: string): Promise<RoleDto> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: {
          select: { id: true },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Роль не найдена');
    }

    return this.formatRole(role);
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleDto> {
    // Проверяем уникальность имени роли
    const existingRole = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Роль с таким названием уже существует');
    }

    // Проверяем существование всех прав
    const permissions = await this.prisma.permission.findMany({
      where: {
        id: {
          in: createRoleDto.permissionIds,
        },
      },
    });

    if (permissions.length !== createRoleDto.permissionIds.length) {
      throw new BadRequestException('Некоторые права доступа не найдены');
    }

    // Создаем роль
    const role = await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
        isSystem: createRoleDto.isSystem || false,
        permissions: {
          create: createRoleDto.permissionIds.map(permissionId => ({
            permission: {
              connect: { id: permissionId },
            },
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: {
          select: { id: true },
        },
      },
    });

    return this.formatRole(role);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleDto> {
    const existingRole = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw new NotFoundException('Роль не найдена');
    }

    if (existingRole.isSystem) {
      throw new BadRequestException('Системную роль нельзя изменять');
    }

    // Проверяем уникальность имени (если меняется)
    if (updateRoleDto.name && updateRoleDto.name !== existingRole.name) {
      const roleWithSameName = await this.prisma.role.findUnique({
        where: { name: updateRoleDto.name },
      });

      if (roleWithSameName) {
        throw new ConflictException('Роль с таким названием уже существует');
      }
    }

    // Если обновляются права, проверяем их существование
    if (updateRoleDto.permissionIds) {
      const permissions = await this.prisma.permission.findMany({
        where: {
          id: {
            in: updateRoleDto.permissionIds,
          },
        },
      });

      if (permissions.length !== updateRoleDto.permissionIds.length) {
        throw new BadRequestException('Некоторые права доступа не найдены');
      }

      // Удаляем старые связи с правами и создаем новые
      await this.prisma.rolePermission.deleteMany({
        where: { roleId: id },
      });
    }

    // Обновляем роль
    const role = await this.prisma.role.update({
      where: { id },
      data: {
        name: updateRoleDto.name,
        description: updateRoleDto.description,
        ...(updateRoleDto.permissionIds && {
          permissions: {
            create: updateRoleDto.permissionIds.map(permissionId => ({
              permission: {
                connect: { id: permissionId },
              },
            })),
          },
        }),
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: {
          select: { id: true },
        },
      },
    });

    return this.formatRole(role);
  }

  async deleteRole(id: string): Promise<{ message: string }> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Роль не найдена');
    }

    if (role.isSystem) {
      throw new BadRequestException('Системную роль нельзя удалить');
    }

    if (role.users.length > 0) {
      throw new BadRequestException('Нельзя удалить роль, к которой привязаны пользователи');
    }

    await this.prisma.role.delete({
      where: { id },
    });

    return { message: 'Роль успешно удалена' };
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<{ message: string }> {
    // Проверяем существование пользователя и роли
    const [user, role] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.role.findUnique({ where: { id: roleId } }),
    ]);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (!role) {
      throw new NotFoundException('Роль не найдена');
    }

    // Проверяем, не назначена ли уже эта роль
    const existingAssignment = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    if (existingAssignment) {
      throw new ConflictException('Роль уже назначена пользователю');
    }

    await this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });

    return { message: 'Роль успешно назначена пользователю' };
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<{ message: string }> {
    const existingAssignment = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    if (!existingAssignment) {
      throw new NotFoundException('Роль не назначена пользователю');
    }

    await this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    return { message: 'Роль успешно удалена у пользователя' };
  }

  private formatRole(role: any): RoleDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      permissions: role.permissions?.map((rp: any) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        category: rp.permission.category,
        description: rp.permission.description,
        createdAt: rp.permission.createdAt,
        updatedAt: rp.permission.updatedAt,
      })) || [],
      usersCount: role.users?.length || 0,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
} 