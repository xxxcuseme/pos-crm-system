import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class AuthTokensDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string = 'Bearer';

  @ApiProperty({ example: 3600 })
  expiresIn: number;
}

export class UserProfileDto {
  @ApiProperty({ example: 'user-id-123' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'Иван' })
  firstName: string;

  @ApiProperty({ example: 'Иванов' })
  lastName: string;

  @ApiProperty({ example: '+7 (999) 123-45-67', required: false })
  phone?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  avatar?: string;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2023-10-01T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ 
    example: [{ id: 'role-1', name: 'Manager', description: 'Store Manager' }],
    type: 'array'
  })
  roles: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

export class LoginResponseDto extends AuthTokensDto {
  @ApiProperty({ type: UserProfileDto })
  user: UserProfileDto;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'Заявка на регистрацию отправлена. Ожидайте подтверждения администратора.' })
  message: string;

  @ApiProperty({ type: UserProfileDto })
  user: UserProfileDto;
} 