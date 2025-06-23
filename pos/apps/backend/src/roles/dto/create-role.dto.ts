import { IsString, IsBoolean, IsArray, IsUUID, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'Manager' })
  @IsString()
  @MinLength(2, { message: 'Название роли должно содержать минимум 2 символа' })
  name: string;

  @ApiPropertyOptional({ example: 'Менеджер магазина с правами управления продажами' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    example: false,
    description: 'Системная роль не может быть удалена' 
  })
  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;

  @ApiProperty({ 
    example: ['perm-id-1', 'perm-id-2'],
    description: 'Массив ID прав доступа'
  })
  @IsArray()
  @IsUUID('4', { each: true, message: 'Каждый ID права должен быть валидным UUID' })
  permissionIds: string[];
} 