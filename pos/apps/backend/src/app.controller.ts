import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  @Public()
  @ApiOperation({ 
    summary: 'Health Check', 
    description: 'Проверка работоспособности API' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API работает корректно',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        version: { type: 'string', example: '1.0.0' },
        environment: { type: 'string', example: 'production' }
      }
    }
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      message: 'POS CRM API is running successfully'
    };
  }

  @Get('ping')
  @Public()
  @ApiOperation({ 
    summary: 'Ping', 
    description: 'Простая проверка доступности' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pong',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'pong' }
      }
    }
  })
  ping() {
    return { message: 'pong' };
  }
} 