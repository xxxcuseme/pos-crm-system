import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000', // admin-panel (dev)
      'http://localhost:3002', // pos-terminal (dev)
      process.env.FRONTEND_URL, // production frontend
      /\.railway\.app$/, // Railway domains
      /\.vercel\.app$/, // Vercel domains
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('POS CRM API')
    .setDescription('API документация для POS CRM системы')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT токен для авторизации',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Аутентификация и авторизация')
    .addTag('Users', 'Управление пользователями')
    .addTag('Products', 'Управление товарами')
    .addTag('Sales', 'Продажи')
    .addTag('Customers', 'Клиенты')
    .addTag('Roles', 'Роли и права')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap(); 