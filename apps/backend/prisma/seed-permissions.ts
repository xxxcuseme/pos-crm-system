import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const permissions = [
  // Пользователи
  {
    name: 'users.read',
    category: 'Users',
    description: 'Просмотр пользователей',
  },
  {
    name: 'users.create',
    category: 'Users',
    description: 'Создание пользователей',
  },
  {
    name: 'users.update',
    category: 'Users',
    description: 'Редактирование пользователей',
  },
  {
    name: 'users.delete',
    category: 'Users',
    description: 'Удаление пользователей',
  },
  {
    name: 'users.approve',
    category: 'Users',
    description: 'Подтверждение заявок пользователей',
  },

  // Роли и права
  {
    name: 'roles.read',
    category: 'Roles',
    description: 'Просмотр ролей',
  },
  {
    name: 'roles.create',
    category: 'Roles',
    description: 'Создание ролей',
  },
  {
    name: 'roles.update',
    category: 'Roles',
    description: 'Редактирование ролей',
  },
  {
    name: 'roles.delete',
    category: 'Roles',
    description: 'Удаление ролей',
  },
  {
    name: 'roles.assign',
    category: 'Roles',
    description: 'Назначение ролей пользователям',
  },
  {
    name: 'permissions.read',
    category: 'Roles',
    description: 'Просмотр прав доступа',
  },

  // Товары
  {
    name: 'products.read',
    category: 'Products',
    description: 'Просмотр товаров',
  },
  {
    name: 'products.create',
    category: 'Products',
    description: 'Создание товаров',
  },
  {
    name: 'products.update',
    category: 'Products',
    description: 'Редактирование товаров',
  },
  {
    name: 'products.delete',
    category: 'Products',
    description: 'Удаление товаров',
  },

  // Продажи
  {
    name: 'sales.read',
    category: 'Sales',
    description: 'Просмотр продаж',
  },
  {
    name: 'sales.create',
    category: 'Sales',
    description: 'Создание продаж',
  },
  {
    name: 'sales.update',
    category: 'Sales',
    description: 'Редактирование продаж',
  },
  {
    name: 'sales.delete',
    category: 'Sales',
    description: 'Удаление продаж',
  },
  {
    name: 'sales.reports',
    category: 'Sales',
    description: 'Отчеты по продажам',
  },

  // Клиенты
  {
    name: 'customers.read',
    category: 'Customers',
    description: 'Просмотр клиентов',
  },
  {
    name: 'customers.create',
    category: 'Customers',
    description: 'Создание клиентов',
  },
  {
    name: 'customers.update',
    category: 'Customers',
    description: 'Редактирование клиентов',
  },
  {
    name: 'customers.delete',
    category: 'Customers',
    description: 'Удаление клиентов',
  },

  // Контрагенты
  {
    name: 'counterparties.read',
    category: 'Counterparties',
    description: 'Просмотр контрагентов',
  },
  {
    name: 'counterparties.create',
    category: 'Counterparties',
    description: 'Создание контрагентов',
  },
  {
    name: 'counterparties.update',
    category: 'Counterparties',
    description: 'Редактирование контрагентов',
  },
  {
    name: 'counterparties.delete',
    category: 'Counterparties',
    description: 'Удаление контрагентов',
  },

  // Бонусные транзакции
  {
    name: 'bonus-transactions.read',
    category: 'Bonus',
    description: 'Просмотр бонусных транзакций',
  },
  {
    name: 'bonus-transactions.create',
    category: 'Bonus',
    description: 'Создание бонусных транзакций',
  },
  {
    name: 'bonus-transactions.update',
    category: 'Bonus',
    description: 'Редактирование бонусных транзакций',
  },

  // Настройки системы
  {
    name: 'settings.read',
    category: 'Settings',
    description: 'Просмотр настроек',
  },
  {
    name: 'settings.update',
    category: 'Settings',
    description: 'Изменение настроек',
  },
  {
    name: 'system.admin',
    category: 'Settings',
    description: 'Полный доступ к системе',
  },

  // Отчеты
  {
    name: 'reports.sales',
    category: 'Reports',
    description: 'Отчеты по продажам',
  },
  {
    name: 'reports.products',
    category: 'Reports',
    description: 'Отчеты по товарам',
  },
  {
    name: 'reports.customers',
    category: 'Reports',
    description: 'Отчеты по клиентам',
  },
  {
    name: 'reports.financial',
    category: 'Reports',
    description: 'Финансовые отчеты',
  },
];

const roles = [
  {
    name: 'Super Admin',
    description: 'Полный доступ ко всем функциям системы',
    isSystem: true,
    permissions: permissions.map(p => p.name), // Все права
  },
  {
    name: 'Admin',
    description: 'Администратор с правами управления пользователями и системой',
    isSystem: true,
    permissions: [
      'users.read', 'users.create', 'users.update', 'users.approve',
      'roles.read', 'roles.create', 'roles.update', 'roles.assign',
      'permissions.read',
      'products.read', 'products.create', 'products.update', 'products.delete',
      'sales.read', 'sales.reports',
      'customers.read', 'customers.create', 'customers.update',
      'settings.read', 'settings.update',
      'reports.sales', 'reports.products', 'reports.customers', 'reports.financial',
    ],
  },
  {
    name: 'Manager',
    description: 'Менеджер с правами управления продажами и клиентами',
    isSystem: false,
    permissions: [
      'products.read', 'products.create', 'products.update',
      'sales.read', 'sales.create', 'sales.update', 'sales.reports',
      'customers.read', 'customers.create', 'customers.update',
      'counterparties.read', 'counterparties.create', 'counterparties.update',
      'bonus-transactions.read', 'bonus-transactions.create',
      'reports.sales', 'reports.products', 'reports.customers',
    ],
  },
  {
    name: 'Cashier',
    description: 'Кассир с правами продаж и работы с клиентами',
    isSystem: false,
    permissions: [
      'products.read',
      'sales.read', 'sales.create',
      'customers.read', 'customers.create', 'customers.update',
      'bonus-transactions.read', 'bonus-transactions.create',
    ],
  },
];

async function seedPermissions() {
  console.log('🌱 Создание прав доступа...');

  // Создаем права доступа
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {
        category: permission.category,
        description: permission.description,
      },
      create: permission,
    });
  }

  console.log(`✅ Создано ${permissions.length} прав доступа`);

  // Создаем роли
  for (const roleData of roles) {
    const { permissions: rolePermissions, ...role } = roleData;

    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    });

    if (existingRole) {
      console.log(`⚠️  Роль "${role.name}" уже существует, пропускаем`);
      continue;
    }

    // Получаем ID прав для роли
    const permissionRecords = await prisma.permission.findMany({
      where: {
        name: {
          in: rolePermissions,
        },
      },
    });

    // Создаем роль с правами
    await prisma.role.create({
      data: {
        ...role,
        permissions: {
          create: permissionRecords.map(permission => ({
            permission: {
              connect: { id: permission.id },
            },
          })),
        },
      },
    });

    console.log(`✅ Создана роль "${role.name}" с ${permissionRecords.length} правами`);
  }

  console.log('🎉 Seeding прав доступа и ролей завершен!');
}

async function main() {
  try {
    await seedPermissions();
  } catch (error) {
    console.error('❌ Ошибка при seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedPermissions }; 