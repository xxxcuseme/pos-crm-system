import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...');

  // ============================================================================
  // ПРАВА ДОСТУПА
  // ============================================================================
  
  console.log('📋 Создание прав доступа...');
  
  const permissions = [
    // Пользователи
    { name: 'users.view', description: 'Просмотр пользователей', category: 'users' },
    { name: 'users.create', description: 'Создание пользователей', category: 'users' },
    { name: 'users.edit', description: 'Редактирование пользователей', category: 'users' },
    { name: 'users.delete', description: 'Удаление пользователей', category: 'users' },
    
    // Роли
    { name: 'roles.view', description: 'Просмотр ролей', category: 'roles' },
    { name: 'roles.create', description: 'Создание ролей', category: 'roles' },
    { name: 'roles.edit', description: 'Редактирование ролей', category: 'roles' },
    { name: 'roles.delete', description: 'Удаление ролей', category: 'roles' },
    
    // Товары
    { name: 'products.view', description: 'Просмотр товаров', category: 'products' },
    { name: 'products.create', description: 'Создание товаров', category: 'products' },
    { name: 'products.edit', description: 'Редактирование товаров', category: 'products' },
    { name: 'products.delete', description: 'Удаление товаров', category: 'products' },
    { name: 'products.import', description: 'Импорт товаров', category: 'products' },
    
    // Категории
    { name: 'categories.view', description: 'Просмотр категорий', category: 'categories' },
    { name: 'categories.create', description: 'Создание категорий', category: 'categories' },
    { name: 'categories.edit', description: 'Редактирование категорий', category: 'categories' },
    { name: 'categories.delete', description: 'Удаление категорий', category: 'categories' },
    
    // Продажи
    { name: 'sales.view', description: 'Просмотр продаж', category: 'sales' },
    { name: 'sales.create', description: 'Создание продаж', category: 'sales' },
    { name: 'sales.edit', description: 'Редактирование продаж', category: 'sales' },
    { name: 'sales.cancel', description: 'Отмена продаж', category: 'sales' },
    { name: 'sales.refund', description: 'Возврат продаж', category: 'sales' },
    
    // Клиенты
    { name: 'customers.view', description: 'Просмотр клиентов', category: 'customers' },
    { name: 'customers.create', description: 'Создание клиентов', category: 'customers' },
    { name: 'customers.edit', description: 'Редактирование клиентов', category: 'customers' },
    { name: 'customers.delete', description: 'Удаление клиентов', category: 'customers' },
    
    // Бонусы
    { name: 'bonuses.view', description: 'Просмотр бонусов', category: 'bonuses' },
    { name: 'bonuses.accrual', description: 'Начисление бонусов', category: 'bonuses' },
    { name: 'bonuses.spending', description: 'Списание бонусов', category: 'bonuses' },
    { name: 'bonuses.adjustment', description: 'Корректировка бонусов', category: 'bonuses' },
    
    // Отчеты
    { name: 'reports.view', description: 'Просмотр отчетов', category: 'reports' },
    { name: 'reports.export', description: 'Экспорт отчетов', category: 'reports' },
    { name: 'reports.financial', description: 'Финансовые отчеты', category: 'reports' },
    
    // Контрагенты/Терминалы
    { name: 'counterparties.view', description: 'Просмотр контрагентов', category: 'counterparties' },
    { name: 'counterparties.create', description: 'Создание контрагентов', category: 'counterparties' },
    { name: 'counterparties.edit', description: 'Редактирование контрагентов', category: 'counterparties' },
    { name: 'counterparties.delete', description: 'Удаление контрагентов', category: 'counterparties' },
    
    // Настройки
    { name: 'settings.view', description: 'Просмотр настроек', category: 'settings' },
    { name: 'settings.edit', description: 'Изменение настроек', category: 'settings' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  // ============================================================================
  // РОЛИ
  // ============================================================================
  
  console.log('👥 Создание ролей...');
  
  // Администратор - все права
  const adminRole = await prisma.role.upsert({
    where: { name: 'Администратор' },
    update: {},
    create: {
      name: 'Администратор',
      description: 'Полный доступ ко всем функциям системы',
      isSystem: true,
    },
  });

  // Менеджер - управление продажами и клиентами
  const managerRole = await prisma.role.upsert({
    where: { name: 'Менеджер' },
    update: {},
    create: {
      name: 'Менеджер',
      description: 'Управление продажами, клиентами и отчетами',
      isSystem: true,
    },
  });

  // Кассир - только продажи
  const cashierRole = await prisma.role.upsert({
    where: { name: 'Кассир' },
    update: {},
    create: {
      name: 'Кассир',
      description: 'Проведение продаж и работа с клиентами',
      isSystem: true,
    },
  });

  // Привязка прав к ролям
  const allPermissions = await prisma.permission.findMany();
  
  // Администратор - все права
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Менеджер - выборочные права
  const managerPermissions = allPermissions.filter(p => 
    !p.name.includes('users.') && 
    !p.name.includes('roles.') &&
    !p.name.includes('settings.')
  );
  
  for (const permission of managerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: managerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: managerRole.id,
        permissionId: permission.id,
      },
    });
  }

  // Кассир - минимальные права
  const cashierPermissionNames = [
    'products.view',
    'categories.view', 
    'sales.view',
    'sales.create',
    'customers.view',
    'customers.create',
    'bonuses.view',
    'bonuses.spending',
  ];
  
  const cashierPermissions = allPermissions.filter(p => 
    cashierPermissionNames.includes(p.name)
  );
  
  for (const permission of cashierPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: cashierRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: cashierRole.id,
        permissionId: permission.id,
      },
    });
  }

  // ============================================================================
  // КОНТРАГЕНТЫ
  // ============================================================================
  
  console.log('🏢 Создание контрагентов...');
  
  const mainTerminal = await prisma.counterparty.upsert({
    where: { code: 'MAIN_TERMINAL' },
    update: {},
    create: {
      name: 'Главный терминал',
      type: 'TERMINAL',
      code: 'MAIN_TERMINAL',
      address: 'Офис компании',
      settings: {
        printReceipts: true,
        allowDiscount: true,
        maxDiscountPercent: 20,
        workingHours: {
          start: '09:00',
          end: '21:00'
        }
      },
    },
  });

  // ============================================================================
  // ПОЛЬЗОВАТЕЛИ
  // ============================================================================
  
  console.log('👤 Создание пользователей...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pos-crm.local' },
    update: {},
    create: {
      email: 'admin@pos-crm.local',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Системный',
      lastName: 'Администратор',
      phone: '+7 (999) 123-45-67',
      status: 'APPROVED',
      isActive: true,
    },
  });

  // Привязка роли к пользователю
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  // Привязка пользователя к терминалу
  await prisma.counterpartyUser.upsert({
    where: {
      counterpartyId_userId: {
        counterpartyId: mainTerminal.id,
        userId: adminUser.id,
      },
    },
    update: {},
    create: {
      counterpartyId: mainTerminal.id,
      userId: adminUser.id,
    },
  });

  // ============================================================================
  // КАТЕГОРИИ
  // ============================================================================
  
  console.log('📂 Создание категорий...');
  
  const categories = [
    { name: 'Продукты питания', description: 'Основные продукты питания' },
    { name: 'Напитки', description: 'Безалкогольные и алкогольные напитки' },
    { name: 'Хозяйственные товары', description: 'Товары для дома и быта' },
    { name: 'Косметика и гигиена', description: 'Средства красоты и гигиены' },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        description: category.description,
        sortOrder: createdCategories.length,
      },
    });
    createdCategories.push(created);
  }

  // ============================================================================
  // ТОВАРЫ
  // ============================================================================
  
  console.log('📦 Создание товаров...');
  
  const products = [
    {
      name: 'Хлеб белый',
      sku: 'BREAD001',
      barcode: '4607034170000',
      price: 45.50,
      cost: 32.00,
      stock: 100,
      categoryName: 'Продукты питания',
      bonusPercent: 2.0,
    },
    {
      name: 'Молоко 3.2%',
      sku: 'MILK001',
      barcode: '4607034170001',
      price: 89.90,
      cost: 65.00,
      stock: 50,
      categoryName: 'Продукты питания',
      bonusPercent: 3.0,
    },
    {
      name: 'Вода питьевая 1.5л',
      sku: 'WATER001',
      barcode: '4607034170002',
      price: 35.00,
      cost: 22.00,
      stock: 200,
      categoryName: 'Напитки',
      bonusPercent: 1.0,
    },
    {
      name: 'Шампунь',
      sku: 'SHAMP001',
      barcode: '4607034170003',
      price: 299.99,
      cost: 180.00,
      stock: 25,
      categoryName: 'Косметика и гигиена',
      bonusPercent: 5.0,
    },
  ];

  for (const product of products) {
    const category = createdCategories.find(c => c.name === product.categoryName);
    
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        minStock: 10,
        maxStock: 500,
        categoryId: category?.id,
        bonusPercent: product.bonusPercent,
        isActive: true,
      },
    });
  }

  // ============================================================================
  // ТЕСТОВЫЙ КЛИЕНТ
  // ============================================================================
  
  console.log('👥 Создание тестового клиента...');
  
  await prisma.customer.upsert({
    where: { email: 'test@customer.local' },
    update: {},
    create: {
      firstName: 'Иван',
      lastName: 'Иванов',
      email: 'test@customer.local',
      phone: '+7 (999) 111-22-33',
      bonusBalance: 150.00,
      isActive: true,
    },
  });

  console.log('✅ База данных успешно заполнена!');
  console.log('');
  console.log('🔑 Данные для входа:');
  console.log('Email: admin@pos-crm.local');
  console.log('Password: admin123');
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 