import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Проверяем уникальность email и username
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
        deletedAt: null,
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Создаем пользователя
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phone: createUserDto.phone,
        avatar: createUserDto.avatar,
        status: createUserDto.status,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Добавляем роли если указаны
    if (createUserDto.roleIds?.length) {
      await Promise.all(
        createUserDto.roleIds.map(roleId =>
          this.prisma.userRole.create({
            data: {
              userId: user.id,
              roleId,
            },
          }),
        ),
      );
    }

    // Добавляем терминалы если указаны
    if (createUserDto.counterpartyIds?.length) {
      await Promise.all(
        createUserDto.counterpartyIds.map(counterpartyId =>
          this.prisma.counterpartyUser.create({
            data: {
              userId: user.id,
              counterpartyId,
            },
          }),
        ),
      );
    }

    // Возвращаем пользователя без пароля
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    // Базовые условия поиска
    const where: any = {
      deletedAt: null,
    };

    // Поиск по тексту
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Сортировка
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          status: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          roles: {
            include: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return new PaginatedResponseDto(users, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        status: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        counterpartyUsers: {
          include: {
            counterparty: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(id);

    // Проверяем уникальность email и username если они изменяются
    if (updateUserDto.email || updateUserDto.username) {
      const conflictUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: updateUserDto.email },
            { username: updateUserDto.username },
          ],
          NOT: { id },
          deletedAt: null,
        },
      });

      if (conflictUser) {
        throw new ConflictException('User with this email or username already exists');
      }
    }

    // Обновляем основные данные пользователя
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        username: updateUserDto.username,
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        phone: updateUserDto.phone,
        avatar: updateUserDto.avatar,
        status: updateUserDto.status,
      },
    });

    // Обновляем роли если указаны
    if (updateUserDto.roleIds) {
      // Удаляем старые роли
      await this.prisma.userRole.deleteMany({
        where: { userId: id },
      });

      // Добавляем новые роли
      if (updateUserDto.roleIds.length > 0) {
        await Promise.all(
          updateUserDto.roleIds.map(roleId =>
            this.prisma.userRole.create({
              data: {
                userId: id,
                roleId,
              },
            }),
          ),
        );
      }
    }

    // Обновляем терминалы если указаны
    if (updateUserDto.counterpartyIds) {
      // Удаляем старые привязки
      await this.prisma.counterpartyUser.deleteMany({
        where: { userId: id },
      });

      // Добавляем новые привязки
      if (updateUserDto.counterpartyIds.length > 0) {
        await Promise.all(
          updateUserDto.counterpartyIds.map(counterpartyId =>
            this.prisma.counterpartyUser.create({
              data: {
                userId: id,
                counterpartyId,
              },
            }),
          ),
        );
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id); // Проверяем существование

    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  async restore(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: null,
        isActive: true,
      },
    });
  }

  async changePassword(id: string, newPassword: string) {
    await this.findOne(id);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  }
} 