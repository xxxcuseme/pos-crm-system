import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionDto, PermissionCategoryDto, PermissionsResponseDto } from './dto/permission-response.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async getAllPermissions(): Promise<PermissionsResponseDto> {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    // Группируем права по категориям
    const permissionsByCategory = permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(this.formatPermission(permission));
      return acc;
    }, {} as Record<string, PermissionDto[]>);

    const data: PermissionCategoryDto[] = Object.entries(permissionsByCategory).map(
      ([category, permissions]) => ({
        category,
        permissions,
      })
    );

    return {
      data,
      total: permissions.length,
    };
  }

  async getPermissionsByIds(permissionIds: string[]): Promise<PermissionDto[]> {
    const permissions = await this.prisma.permission.findMany({
      where: {
        id: {
          in: permissionIds,
        },
      },
    });

    return permissions.map(this.formatPermission);
  }

  /**
   * Проверяет наличие конкретного права у пользователя
   */
  async userHasPermission(userId: string, permissionName: string): Promise<boolean> {
    const userWithPermissions = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithPermissions) {
      return false;
    }

    // Собираем все права пользователя из всех его ролей
    const userPermissions = userWithPermissions.roles.flatMap(userRole =>
      userRole.role.permissions.map(rolePermission => rolePermission.permission.name)
    );

    return userPermissions.includes(permissionName);
  }

  /**
   * Получает все права пользователя
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const userWithPermissions = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithPermissions) {
      return [];
    }

    // Собираем уникальные права из всех ролей
    const permissionsSet = new Set<string>();
    userWithPermissions.roles.forEach(userRole => {
      userRole.role.permissions.forEach(rolePermission => {
        permissionsSet.add(rolePermission.permission.name);
      });
    });

    return Array.from(permissionsSet);
  }

  /**
   * Проверяет наличие прав у объекта пользователя (для Guards)
   */
  has(user: any, permissionName: string): boolean {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permissionName);
  }

  private formatPermission(permission: any): PermissionDto {
    return {
      id: permission.id,
      name: permission.name,
      category: permission.category,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
} 