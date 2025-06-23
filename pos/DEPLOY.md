# Развертывание POS CRM Backend на Railway

## 🚀 Быстрый старт

### 1. Подготовка проекта

Убедитесь, что ваш код находится в GitHub репозитории и включает следующие файлы:
- `railway.json` - конфигурация Railway
- `nixpacks.toml` - конфигурация сборки
- `apps/backend/Dockerfile` - Docker конфигурация (опционально)

### 2. Создание проекта на Railway

1. Перейдите на [railway.app](https://railway.app)
2. Войдите через GitHub
3. Нажмите "New Project" → "Deploy from GitHub repo"
4. Выберите ваш репозиторий с POS CRM

### 3. Настройка PostgreSQL

1. В созданном проекте нажмите "Add Service" → "Database" → "PostgreSQL"
2. Railway автоматически создаст PostgreSQL инстанс
3. В разделе "Variables" появится переменная `DATABASE_URL`

### 4. Настройка сервиса backend

1. Нажмите на сервис с вашим кодом
2. Перейдите в "Settings"
3. Настройте следующие параметры:

#### Build Configuration
```
Build Command: cd apps/backend && npm install && npx prisma generate && npm run build
Start Command: node dist/main.js
Root Directory: .
```

#### Environment Variables
Добавьте следующие переменные в разделе "Variables":

```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
```

**Важно**: `DATABASE_URL` будет автоматически добавлена при подключении PostgreSQL.

### 5. Настройка автодеплоя

1. В "Settings" → "Source" убедитесь, что включен "Auto Deploy"
2. Выберите ветку для автодеплоя (обычно `main` или `master`)

### 6. Переименование сервиса

1. В "Settings" → "General" измените "Service Name" на `pos-crm-backend`

### 7. Запуск миграций

После первого успешного деплоя:

1. Перейдите в "Console" или используйте Railway CLI
2. Выполните команды:

```bash
# Применить миграции
npx prisma migrate deploy

# Заполнить базу данных начальными данными
npm run db:seed
```

## 🔧 Конфигурация

### Railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd apps/backend && npm install && npx prisma generate && npm run build",
    "watchPatterns": ["apps/backend/**"]
  },
  "deploy": {
    "startCommand": "node dist/main.js",
    "healthcheckPath": "/api",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Переменные окружения

| Переменная | Описание | Обязательная |
|------------|----------|--------------|
| `DATABASE_URL` | URL подключения к PostgreSQL | ✅ |
| `NODE_ENV` | Режим работы (production) | ✅ |
| `PORT` | Порт приложения (3001) | ✅ |
| `JWT_SECRET` | Секретный ключ для JWT | ✅ |
| `JWT_EXPIRES_IN` | Время жизни JWT токена | ❌ |
| `FRONTEND_URL` | URL фронтенда для CORS | ❌ |

## 📋 Команды управления

### Локально через Railway CLI

```bash
# Установить Railway CLI
npm install -g @railway/cli

# Войти в аккаунт
railway login

# Связать с проектом
railway link

# Выполнить команду на сервере
railway run npx prisma migrate deploy

# Просмотр логов
railway logs

# Открыть приложение
railway open
```

### Через веб-интерфейс

1. Откройте проект на railway.app
2. Перейдите в сервис `pos-crm-backend`
3. Во вкладке "Console" выполните нужные команды

## 🌐 Доступ к API

После успешного деплоя API будет доступно по адресу:
- **API**: `https://pos-crm-backend-production.up.railway.app/api`
- **Swagger документация**: `https://pos-crm-backend-production.up.railway.app/api/docs`

## 🔍 Мониторинг

### Логи
- В Railway dashboard перейдите в "Logs" для просмотра логов в реальном времени

### Метрики
- Во вкладке "Metrics" отслеживайте:
  - Использование CPU
  - Использование памяти
  - Сетевой трафик
  - Время отклика

### Health Check
- Railway автоматически проверяет доступность по пути `/api`
- При недоступности сервис будет перезапущен

## 🛠 Troubleshooting

### Проблема: Build fails
**Решение**: Проверьте логи сборки, убедитесь что все зависимости указаны в `package.json`

### Проблема: Database connection error
**Решение**: 
1. Убедитесь что PostgreSQL сервис запущен
2. Проверьте переменную `DATABASE_URL`
3. Выполните `npx prisma generate`

### Проблема: JWT errors
**Решение**: Убедитесь что `JWT_SECRET` содержит минимум 32 символа

### Проблема: CORS errors
**Решение**: Добавьте URL фронтенда в переменную `FRONTEND_URL`

## 📚 Полезные ссылки

- [Railway Documentation](https://docs.railway.app)
- [NestJS Deployment](https://docs.nestjs.com/techniques/performance)
- [Prisma Railway Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)

## 🔐 Безопасность

### Рекомендации:
1. Используйте сложный `JWT_SECRET` (минимум 32 символа)
2. Настройте правильные CORS политики
3. Регулярно обновляйте зависимости
4. Мониторьте логи на предмет подозрительной активности
5. Используйте HTTPS для всех соединений

### Environment Variables Security:
- Никогда не коммитьте секретные ключи в Git
- Используйте Railway Variables для конфиденциальных данных
- Регулярно ротируйте JWT_SECRET 