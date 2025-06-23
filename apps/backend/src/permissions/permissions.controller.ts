import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { PermissionsResponseDto } from './dto/permission-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions('permissions.read')
  @ApiOperation({ summary: 'Получить все права доступа, сгруппированные по категориям' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список всех прав доступа', 
    type: PermissionsResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async getAllPermissions(): Promise<PermissionsResponseDto> {
    return this.permissionsService.getAllPermissions();
  }
} 