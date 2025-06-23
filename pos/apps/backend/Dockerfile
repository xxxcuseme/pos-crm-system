# Используем официальный Node.js образ
FROM node:18-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package files для установки зависимостей
COPY apps/backend/package*.json ./
COPY apps/backend/prisma ./prisma/

# Устанавливаем зависимости
RUN npm ci --only=production && npm cache clean --force

# Генерируем Prisma client
RUN npx prisma generate

# Копируем исходный код
COPY apps/backend/src ./src
COPY apps/backend/tsconfig*.json ./
COPY apps/backend/nest-cli.json ./

# Устанавливаем dev зависимости для сборки
RUN npm ci

# Собираем приложение
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Копируем package files
COPY apps/backend/package*.json ./
COPY apps/backend/prisma ./prisma/

# Устанавливаем только production зависимости
RUN npm ci --only=production && npm cache clean --force

# Генерируем Prisma client
RUN npx prisma generate

# Копируем собранное приложение
COPY --from=base /app/dist ./dist

# Создаем non-root пользователя
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Меняем владельца файлов
USER nestjs

# Открываем порт
EXPOSE 3001

# Запускаем приложение
CMD ["node", "dist/main.js"] 