import { ApiProperty } from '@nestjs/swagger';
import { PermissionDto } from '../../permissions/dto/permission-response.dto';

export class RoleDto {
  @ApiProperty({ example: 'role-id-123' })
  id: string;

  @ApiProperty({ example: 'Manager' })
  name: string;

  @ApiProperty({ example: 'Менеджер магазина с правами управления продажами' })
  description?: string;

  @ApiProperty({ example: false })
  isSystem: boolean;

  @ApiProperty({ type: [PermissionDto] })
  permissions: PermissionDto[];

  @ApiProperty({ example: 5 })
  usersCount: number;

  @ApiProperty({ example: '2023-10-01T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-01T10:00:00Z' })
  updatedAt: Date;
}

export class RolesResponseDto {
  @ApiProperty({ type: [RoleDto] })
  data: RoleDto[];

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}

export class RoleCreatedDto {
  @ApiProperty({ example: 'Роль успешно создана' })
  message: string;

  @ApiProperty({ type: RoleDto })
  role: RoleDto;
}

export class RoleUpdatedDto {
  @ApiProperty({ example: 'Роль успешно обновлена' })
  message: string;

  @ApiProperty({ type: RoleDto })
  role: RoleDto;
}

export class RoleDeletedDto {
  @ApiProperty({ example: 'Роль успешно удалена' })
  message: string;
} 