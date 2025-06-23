import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty({ example: 'perm-id-123' })
  id: string;

  @ApiProperty({ example: 'users.create' })
  name: string;

  @ApiProperty({ example: 'Users' })
  category: string;

  @ApiProperty({ example: 'Создание пользователей' })
  description: string;

  @ApiProperty({ example: '2023-10-01T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-01T10:00:00Z' })
  updatedAt: Date;
}

export class PermissionCategoryDto {
  @ApiProperty({ example: 'Users' })
  category: string;

  @ApiProperty({ type: [PermissionDto] })
  permissions: PermissionDto[];
}

export class PermissionsResponseDto {
  @ApiProperty({ type: [PermissionCategoryDto] })
  data: PermissionCategoryDto[];

  @ApiProperty({ example: 45 })
  total: number;
} 