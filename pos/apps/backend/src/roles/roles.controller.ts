import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleDto, RolesResponseDto, RoleCreatedDto, RoleUpdatedDto, RoleDeletedDto } from './dto/role-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('roles.read')
  @ApiOperation({ summary: 'Получить список ролей с пагинацией' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Список ролей', 
    type: RolesResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async getRoles(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<RolesResponseDto> {
    return this.rolesService.getRoles(page, limit);
  }

  @Get(':id')
  @Permissions('roles.read')
  @ApiOperation({ summary: 'Получить роль по ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Данные роли', 
    type: RoleDto 
  })
  @ApiResponse({ status: 404, description: 'Роль не найдена' })
  async getRoleById(@Param('id') id: string): Promise<RoleDto> {
    return this.rolesService.getRoleById(id);
  }

  @Post()
  @Permissions('roles.create')
  @ApiOperation({ summary: 'Создать новую роль' })
  @ApiResponse({ 
    status: 201, 
    description: 'Роль создана', 
    type: RoleCreatedDto 
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 409, description: 'Роль уже существует' })
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleCreatedDto> {
    const role = await this.rolesService.createRole(createRoleDto);
    return {
      message: 'Роль успешно создана',
      role,
    };
  }

  @Put(':id')
  @Permissions('roles.update')
  @ApiOperation({ summary: 'Обновить роль' })
  @ApiResponse({ 
    status: 200, 
    description: 'Роль обновлена', 
    type: RoleUpdatedDto 
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 404, description: 'Роль не найдена' })
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleUpdatedDto> {
    const role = await this.rolesService.updateRole(id, updateRoleDto);
    return {
      message: 'Роль успешно обновлена',
      role,
    };
  }

  @Delete(':id')
  @Permissions('roles.delete')
  @ApiOperation({ summary: 'Удалить роль' })
  @ApiResponse({ 
    status: 200, 
    description: 'Роль удалена', 
    type: RoleDeletedDto 
  })
  @ApiResponse({ status: 400, description: 'Нельзя удалить системную роль или роль с пользователями' })
  @ApiResponse({ status: 404, description: 'Роль не найдена' })
  @HttpCode(HttpStatus.OK)
  async deleteRole(@Param('id') id: string): Promise<RoleDeletedDto> {
    return this.rolesService.deleteRole(id);
  }

  @Post(':roleId/users/:userId')
  @Permissions('roles.assign')
  @ApiOperation({ summary: 'Назначить роль пользователю' })
  @ApiResponse({ status: 200, description: 'Роль назначена' })
  @ApiResponse({ status: 404, description: 'Пользователь или роль не найдены' })
  @ApiResponse({ status: 409, description: 'Роль уже назначена' })
  @HttpCode(HttpStatus.OK)
  async assignRoleToUser(
    @Param('roleId') roleId: string,
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    return this.rolesService.assignRoleToUser(userId, roleId);
  }

  @Delete(':roleId/users/:userId')
  @Permissions('roles.assign')
  @ApiOperation({ summary: 'Удалить роль у пользователя' })
  @ApiResponse({ status: 200, description: 'Роль удалена' })
  @ApiResponse({ status: 404, description: 'Роль не назначена пользователю' })
  @HttpCode(HttpStatus.OK)
  async removeRoleFromUser(
    @Param('roleId') roleId: string,
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    return this.rolesService.removeRoleFromUser(userId, roleId);
  }
} 