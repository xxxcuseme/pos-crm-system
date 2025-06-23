import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../../permissions/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Получаем требуемые права из декоратора @Permissions()
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // Если права не требуются, разрешаем доступ
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Пользователь не аутентифицирован');
    }

    // Проверяем каждое требуемое право
    for (const permission of requiredPermissions) {
      const hasPermission = this.permissionsService.has(user, permission);
      
      if (!hasPermission) {
        throw new ForbiddenException(`Недостаточно прав: требуется ${permission}`);
      }
    }

    return true;
  }
} 