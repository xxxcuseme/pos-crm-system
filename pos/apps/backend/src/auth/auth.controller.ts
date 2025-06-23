import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, RegisterResponseDto, UserProfileDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ 
    status: 201, 
    description: 'Заявка на регистрацию создана', 
    type: RegisterResponseDto 
  })
  @ApiResponse({ status: 409, description: 'Пользователь уже существует' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Успешная авторизация', 
    type: LoginResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные профиля', 
    type: UserProfileDto 
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getProfile(@CurrentUser() user: any): Promise<UserProfileDto> {
    return this.authService.getProfile(user.id);
  }

  @Post('approve/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permissions('users.approve')
  @ApiOperation({ summary: 'Подтвердить заявку пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь подтвержден' })
  @ApiResponse({ status: 400, description: 'Пользователь не ожидает подтверждения' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @HttpCode(HttpStatus.OK)
  async approveUser(@Param('userId') userId: string): Promise<{ message: string }> {
    return this.authService.approveUser(userId);
  }

  @Post('reject/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Permissions('users.approve')
  @ApiOperation({ summary: 'Отклонить заявку пользователя' })
  @ApiResponse({ status: 200, description: 'Заявка отклонена' })
  @ApiResponse({ status: 400, description: 'Пользователь не ожидает подтверждения' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @HttpCode(HttpStatus.OK)
  async rejectUser(@Param('userId') userId: string): Promise<{ message: string }> {
    return this.authService.rejectUser(userId);
  }
} 