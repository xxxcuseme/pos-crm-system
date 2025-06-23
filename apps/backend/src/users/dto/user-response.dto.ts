import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  lastLoginAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  deletedAt?: Date;
}

export class UserWithRolesResponseDto extends UserResponseDto {
  @ApiProperty({ type: [Object] })
  roles: {
    id: string;
    role: {
      id: string;
      name: string;
      description?: string;
    };
  }[];
} 