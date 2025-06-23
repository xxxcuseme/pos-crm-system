import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserProfileDto, LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    // Проверяем уникальность email и username
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { username: registerDto.username },
        ],
        deletedAt: null,
      },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email или логином уже существует');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // Генерируем аватар по имени, если не предоставлен
    const avatar = registerDto.avatar || this.generateAvatarUrl(
      `${registerDto.firstName} ${registerDto.lastName}`
    );

    // Создаем пользователя со статусом PENDING
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        avatar,
        status: 'PENDING', // Ожидает подтверждения
        isActive: false,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return {
      message: 'Заявка на регистрацию отправлена. Ожидайте подтверждения администратора.',
      user: this.formatUserProfile(user),
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Находим пользователя по email или username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: loginDto.username },
          { username: loginDto.username },
        ],
        deletedAt: null,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // Проверяем статус пользователя
    if (user.status === 'PENDING') {
      throw new UnauthorizedException('Ваша заявка ожидает подтверждения администратора');
    }

    if (user.status === 'REJECTED') {
      throw new UnauthorizedException('Ваша заявка была отклонена администратором');
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Ваш аккаунт заблокирован');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Ваш аккаунт неактивен');
    }

    // Генерируем JWT токен
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '24h'),
    });

    // Обновляем время последнего входа
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 86400, // 24 часа в секундах
      user: this.formatUserProfile(user),
    };
  }

  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { 
        id: userId,
        deletedAt: null,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return this.formatUserProfile(user);
  }

  async approveUser(userId: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (user.status !== 'PENDING') {
      throw new BadRequestException('Пользователь не ожидает подтверждения');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'APPROVED',
        isActive: true,
      },
    });

    return { message: 'Пользователь успешно подтвержден' };
  }

  async rejectUser(userId: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (user.status !== 'PENDING') {
      throw new BadRequestException('Пользователь не ожидает подтверждения');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'REJECTED',
        isActive: false,
      },
    });

    return { message: 'Заявка пользователя отклонена' };
  }

  private formatUserProfile(user: any): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
      isActive: user.isActive,
      createdAt: user.createdAt,
      roles: user.roles?.map((userRole: any) => ({
        id: userRole.role.id,
        name: userRole.role.name,
        description: userRole.role.description,
      })) || [],
    };
  }

  private generateAvatarUrl(name: string): string {
    // Используем UI Avatars API для генерации аватара по имени
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0066cc&color=fff&size=200&format=png&rounded=true&bold=true`;
  }
} 