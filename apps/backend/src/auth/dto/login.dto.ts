import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'john_doe', 
    description: 'Email или username пользователя' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  username: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;
} 