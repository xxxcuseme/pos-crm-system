import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your-secret-key'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { 
        id: payload.sub,
        deletedAt: null,
        isActive: true,
      },
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

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден или неактивен');
    }

    if (user.status !== 'APPROVED') {
      throw new UnauthorizedException('Учетная запись не подтверждена администратором');
    }

    // Обновляем время последнего входа
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Формируем объект пользователя с правами
    const permissions = user.roles.flatMap(userRole => 
      userRole.role.permissions.map(rolePermission => 
        rolePermission.permission.name
      )
    );

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
      roles: user.roles.map(userRole => ({
        id: userRole.role.id,
        name: userRole.role.name,
        description: userRole.role.description,
      })),
      permissions,
    };
  }
} 