# POS CRM Monorepo

Monorepo для системы управления торговлей (Point of Sale CRM) построенная с использованием TurboRepo.

## 📁 Структура проекта

```
pos-crm-monorepo/
├── apps/
│   ├── backend/              # NestJS API сервер
│   │   ├── src/
│   │   ├── prisma/           # Схема и миграции БД
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── admin-panel/          # Next.js админ панель
│   │   ├── src/
│   │   ├── package.json
│   │   ├── next.config.js
│   │   └── tailwind.config.js
│   └── pos-terminal/         # Next.js POS терминал
│       ├── src/
│       ├── package.json
│       ├── next.config.js
│       └── tailwind.config.js
├── packages/
│   ├── ui/                   # Общие UI компоненты
│   │   ├── src/
│   │   └── package.json
│   └── utils/               # Общие утилиты
│       ├── src/
│       └── package.json
├── package.json
├── turbo.json
└── README.md
```

## 🛠 Технологический стек

### Backend
- **NestJS** - Node.js фреймворк для API
- **PostgreSQL** - Реляционная база данных
- **Prisma** - ORM для работы с БД
- **JWT** - Аутентификация
- **Swagger** - Документация API

### Frontend
- **Next.js 14** - React фреймворк (App Router)
- **TypeScript** - Типизация
- **TailwindCSS** - CSS фреймворк
- **shadcn/ui** - UI компоненты
- **React Query** - Управление состоянием сервера
- **React Hook Form** - Формы

### DevOps & Tools
- **TurboRepo** - Монорепо менеджер
- **ESLint** - Линтер
- **Prettier** - Форматтер кода

## 🚀 Начало работы

### Предварительные требования

- Node.js (версия 18+)
- npm или yarn
- PostgreSQL

### Установка

1. Установите зависимости:
```bash
npm install
```

2. Настройте переменные окружения:
```bash
# В apps/backend создайте .env файл на основе .env.example
cp apps/backend/.env.example apps/backend/.env
```

3. Запустите PostgreSQL и обновите DATABASE_URL в .env файле

4. Инициализируйте базу данных:
```bash
npm run db:generate
npm run db:push
```

### Разработка

Запустите все приложения в режиме разработки:
```bash
npm run dev
```

Это запустит:
- Backend API: http://localhost:3001
- Admin Panel: http://localhost:3000
- POS Terminal: http://localhost:3002

### Доступные команды

```bash
# Разработка
npm run dev          # Запуск всех приложений в dev режиме
npm run build        # Сборка всех приложений
npm run lint         # Проверка кода линтером
npm run format       # Форматирование кода

# База данных
npm run db:generate  # Генерация Prisma клиента
npm run db:push      # Синхронизация схемы с БД
npm run db:migrate   # Создание и применение миграций
npm run db:studio    # Открытие Prisma Studio
```

## 📦 Приложения

### Backend (apps/backend)
- **Порт**: 3001
- **API документация**: http://localhost:3001/api
- **Технологии**: NestJS, Prisma, PostgreSQL

**Основные модули**:
- Auth (аутентификация)
- Users (пользователи)
- Products (товары)
- Categories (категории)
- Orders (заказы)
- Customers (клиенты)

### Admin Panel (apps/admin-panel)
- **Порт**: 3000
- **Назначение**: Административная панель для управления системой
- **Функции**:
  - Управление товарами и категориями
  - Управление пользователями
  - Просмотр заказов и отчетов
  - Настройки системы

### POS Terminal (apps/pos-terminal)
- **Порт**: 3002
- **Назначение**: Интерфейс для кассиров
- **Функции**:
  - Оформление продаж
  - Сканирование штрих-кодов
  - Обработка платежей
  - Печать чеков

## 📚 Пакеты

### UI Package (packages/ui)
Библиотека переиспользуемых React компонентов на основе shadcn/ui:
- Button, Input, Card
- Dialog, Select, Tabs
- Table, Form, Toast
- И другие UI компоненты

### Utils Package (packages/utils)
Общие утилиты и хелперы:
- API клиенты
- Валидация (Zod схемы)
- Форматтеры
- Константы

## 🔧 Конфигурация

### TurboRepo
Конфигурация в `turbo.json` определяет задачи и их зависимости для оптимального выполнения в монорепо.

### База данных
Схема Prisma включает основные сущности для POS системы:
- Users (пользователи с ролями)
- Products & Categories (товары и категории)
- Orders & OrderItems (заказы и позиции)
- Customers (клиенты)
- Payments (платежи)

## 🔐 Аутентификация

Система использует JWT токены для аутентификации:
- Роли: ADMIN, MANAGER, CASHIER
- Защищенные маршруты в API
- Авторизация на уровне UI компонентов

## 📝 Разработка

### Добавление нового компонента в UI пакет
```bash
# В packages/ui/src/components/ui/
# Создайте новый компонент и экспортируйте в index.ts
```

### Добавление нового API модуля
```bash
# В apps/backend/src/
# Создайте модуль, контроллер, сервис и DTO
```

### Создание новой страницы
```bash
# В apps/admin-panel/src/app/ или apps/pos-terminal/src/app/
# Используйте App Router структуру Next.js 14
```

## 🤝 Вклад в проект

1. Создайте ветку для новой функции
2. Следуйте существующим соглашениям по коду
3. Добавьте тесты для новой функциональности
4. Убедитесь, что линтер и типы проходят проверку

## 📄 Лицензия

Проект создан для демонстрационных целей. 