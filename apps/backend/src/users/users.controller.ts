import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto, UserWithRolesResponseDto } from './dto/user-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь создан', type: UserWithRolesResponseDto })
  @ApiResponse({ status: 409, description: 'Пользователь с таким email или username уже существует' })
  @Permissions('users.create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список пользователей с пагинацией' })
  @ApiResponse({ status: 200, description: 'Список пользователей', type: PaginatedResponseDto })
  @Permissions('users.view')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({ status: 200, description: 'Данные пользователя', type: UserWithRolesResponseDto })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Permissions('users.view')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь обновлен', type: UserWithRolesResponseDto })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 409, description: 'Пользователь с таким email или username уже существует' })
  @Permissions('users.edit')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя (soft delete)' })
  @ApiResponse({ status: 200, description: 'Пользователь удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Permissions('users.delete')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Восстановить удаленного пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь восстановлен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Permissions('users.edit')
  restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }

  @Post(':id/change-password')
  @ApiOperation({ summary: 'Изменить пароль пользователя' })
  @ApiResponse({ status: 200, description: 'Пароль изменен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @HttpCode(HttpStatus.OK)
  @Permissions('users.edit')
  changePassword(@Param('id') id: string, @Body('newPassword') newPassword: string) {
    return this.usersService.changePassword(id, newPassword);
  }
} 