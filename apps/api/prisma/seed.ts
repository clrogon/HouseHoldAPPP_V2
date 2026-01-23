import { PrismaClient, Role, Priority, TaskStatus, BudgetPeriod, PetSpecies, VehicleType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);

  const household = await prisma.household.create({
    data: {
      name: 'Demo Household',
      address: 'Rua Principal 123, Luanda, Angola',
      phone: '+244923456789',
      creator: {
        create: {
          email: 'admin@household.com',
          password: adminPassword,
          role: Role.ADMIN,
        },
      },
    },
    include: { creator: true },
  });

  // Create admin profile
  await prisma.userProfile.create({
    data: {
      userId: household.creatorId,
      firstName: 'Admin',
      lastName: 'User',
      householdId: household.id,
      language: 'pt-PT',
      timezone: 'Africa/Luanda',
    },
  });

  console.log('✅ Admin user created: admin@household.com / admin123');

  // Create a member user
  const memberPassword = await bcrypt.hash('member123', 10);
  const memberUser = await prisma.user.create({
    data: {
      email: 'member@household.com',
      password: memberPassword,
      role: Role.MEMBER,
      profile: {
        create: {
          firstName: 'Maria',
          lastName: 'Silva',
          householdId: household.id,
          language: 'pt-PT',
          timezone: 'Africa/Luanda',
        },
      },
    },
  });

  console.log('✅ Member user created: member@household.com / member123');

  // Create inventory categories
  const pantryCategory = await prisma.inventoryCategory.create({
    data: {
      name: 'Pantry',
      icon: 'package',
      color: '#8B4513',
      householdId: household.id,
    },
  });

  const fridgeCategory = await prisma.inventoryCategory.create({
    data: {
      name: 'Refrigerator',
      icon: 'snowflake',
      color: '#4169E1',
      householdId: household.id,
    },
  });

  const cleaningCategory = await prisma.inventoryCategory.create({
    data: {
      name: 'Cleaning',
      icon: 'spray',
      color: '#32CD32',
      householdId: household.id,
    },
  });

  console.log('✅ Inventory categories created');

  // Create some inventory items
  await prisma.inventoryItem.createMany({
    data: [
      {
        name: 'Arroz 5kg',
        quantity: 2,
        unit: 'bags',
        categoryId: pantryCategory.id,
        householdId: household.id,
        purchasePrice: 4500,
        lowStockThreshold: 1,
      },
      {
        name: 'Óleo Vegetal 1L',
        quantity: 3,
        unit: 'bottles',
        categoryId: pantryCategory.id,
        householdId: household.id,
        purchasePrice: 2500,
        lowStockThreshold: 2,
      },
      {
        name: 'Leite 1L',
        quantity: 6,
        unit: 'cartons',
        categoryId: fridgeCategory.id,
        householdId: household.id,
        purchasePrice: 900,
        lowStockThreshold: 3,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        name: 'Detergente 2kg',
        quantity: 1,
        unit: 'pack',
        categoryId: cleaningCategory.id,
        householdId: household.id,
        purchasePrice: 3500,
        lowStockThreshold: 1,
      },
    ],
  });

  console.log('✅ Inventory items created');

  // Create some tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Comprar mantimentos',
        description: 'Lista de compras semanal',
        priority: Priority.HIGH,
        status: TaskStatus.PENDING,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        creatorId: household.creatorId,
        householdId: household.id,
        tags: ['shopping', 'weekly'],
      },
      {
        title: 'Limpar a casa',
        description: 'Limpeza geral semanal',
        priority: Priority.MEDIUM,
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        creatorId: household.creatorId,
        assigneeId: memberUser.id,
        householdId: household.id,
        tags: ['cleaning'],
      },
      {
        title: 'Pagar contas',
        description: 'Eletricidade e água',
        priority: Priority.HIGH,
        status: TaskStatus.PENDING,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        creatorId: household.creatorId,
        householdId: household.id,
        tags: ['bills', 'monthly'],
      },
    ],
  });

  console.log('✅ Tasks created');

  // Create a budget
  const budget = await prisma.budget.create({
    data: {
      name: 'Monthly Budget - January 2026',
      period: BudgetPeriod.MONTHLY,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
      totalBudgeted: 500000, // 500,000 AOA
      creatorId: household.creatorId,
      householdId: household.id,
      categories: {
        create: [
          { name: 'Food & Groceries', budgeted: 150000, spent: 45000 },
          { name: 'Utilities', budgeted: 80000, spent: 35000 },
          { name: 'Transportation', budgeted: 60000, spent: 20000 },
          { name: 'Entertainment', budgeted: 40000, spent: 5000 },
          { name: 'Healthcare', budgeted: 50000, spent: 0 },
          { name: 'Other', budgeted: 120000, spent: 15000 },
        ],
      },
    },
  });

  console.log('✅ Budget created');

  // Create some transactions
  await prisma.transaction.createMany({
    data: [
      {
        type: 'EXPENSE',
        amount: 15500,
        category: 'Food & Groceries',
        description: 'Kero Supermercado',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        creatorId: household.creatorId,
        householdId: household.id,
      },
      {
        type: 'EXPENSE',
        amount: 8750,
        category: 'Food & Groceries',
        description: 'Shoprite',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        creatorId: household.creatorId,
        householdId: household.id,
      },
      {
        type: 'EXPENSE',
        amount: 35000,
        category: 'Utilities',
        description: 'ENDE - Eletricidade',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        creatorId: household.creatorId,
        householdId: household.id,
      },
      {
        type: 'INCOME',
        amount: 250000,
        category: 'Salary',
        description: 'Monthly salary',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        creatorId: household.creatorId,
        householdId: household.id,
      },
    ],
  });

  console.log('✅ Transactions created');

  // Create a pet
  await prisma.pet.create({
    data: {
      name: 'Max',
      species: PetSpecies.DOG,
      breed: 'Labrador Retriever',
      birthDate: new Date('2022-06-15'),
      gender: 'male',
      color: 'Golden',
      weight: 28.5,
      vetName: 'Dr. Santos',
      vetPhone: '+244923111222',
      householdId: household.id,
      vaccinations: {
        create: [
          {
            name: 'Rabies',
            dateGiven: new Date('2023-06-15'),
            nextDue: new Date('2024-06-15'),
            vet: 'Dr. Santos',
          },
          {
            name: 'DHPP',
            dateGiven: new Date('2023-06-15'),
            nextDue: new Date('2024-06-15'),
            vet: 'Dr. Santos',
          },
        ],
      },
    },
  });

  console.log('✅ Pet created');

  // Create a vehicle
  await prisma.vehicle.create({
    data: {
      type: VehicleType.CAR,
      make: 'Toyota',
      model: 'Hilux',
      year: 2021,
      color: 'White',
      licensePlate: 'LD-12-34-AB',
      mileage: 45000,
      purchaseDate: new Date('2021-03-15'),
      purchasePrice: 15000000, // 15M AOA
      householdId: household.id,
      insurance: {
        create: {
          provider: 'ENSA Seguros',
          policyNumber: 'AUTO-2024-12345',
          coverageType: 'Comprehensive',
          premium: 450000,
          startDate: new Date('2024-01-01'),
          expiryDate: new Date('2025-01-01'),
        },
      },
      maintenance: {
        create: [
          {
            type: 'Oil Change',
            date: new Date('2024-10-15'),
            mileage: 42000,
            cost: 35000,
            serviceProvider: 'Toyota Angola',
            nextServiceDue: new Date('2025-04-15'),
          },
        ],
      },
      fuelLogs: {
        create: [
          {
            date: new Date('2024-12-20'),
            gallons: 60,
            costPerGallon: 450,
            totalCost: 27000,
            mileage: 44500,
            fuelType: 'Diesel',
            gasStation: 'Pumangol',
          },
        ],
      },
    },
  });

  console.log('✅ Vehicle created');

  // Create an employee (domestic worker)
  await prisma.employee.create({
    data: {
      firstName: 'Ana',
      lastName: 'Fernandes',
      phone: '+244923333444',
      position: 'Housekeeper',
      employmentType: 'Full-time',
      salary: 80000, // Monthly salary in AOA
      payFrequency: 'monthly',
      hireDate: new Date('2023-01-15'),
      householdId: household.id,
      payments: {
        create: [
          {
            amount: 80000,
            paymentDate: new Date('2024-12-01'),
            period: 'December 2024',
            paymentMethod: 'Bank Transfer',
          },
        ],
      },
    },
  });

  console.log('✅ Employee created');

  // Create a recipe
  await prisma.recipe.create({
    data: {
      name: 'Muamba de Galinha',
      description: 'Traditional Angolan chicken stew with palm oil and okra',
      servings: 6,
      prepTime: 30,
      cookTime: 60,
      difficulty: 'medium',
      creatorId: household.creatorId,
      householdId: household.id,
      tags: ['angolan', 'traditional', 'chicken', 'main-course'],
      calories: 450,
      ingredients: {
        create: [
          { name: 'Chicken', quantity: 1.5, unit: 'kg', order: 1 },
          { name: 'Palm oil', quantity: 200, unit: 'ml', order: 2 },
          { name: 'Okra', quantity: 300, unit: 'g', order: 3 },
          { name: 'Onion', quantity: 2, unit: 'large', order: 4 },
          { name: 'Garlic', quantity: 4, unit: 'cloves', order: 5 },
          { name: 'Gindungo (chili)', quantity: 2, unit: 'pieces', order: 6 },
        ],
      },
      instructions: {
        create: [
          { stepNumber: 1, text: 'Season the chicken with salt, garlic, and lemon juice. Let it marinate for 30 minutes.' },
          { stepNumber: 2, text: 'Heat palm oil in a large pot over medium heat.' },
          { stepNumber: 3, text: 'Add onions and cook until translucent.' },
          { stepNumber: 4, text: 'Add the chicken pieces and brown on all sides.' },
          { stepNumber: 5, text: 'Add water to cover the chicken and simmer for 40 minutes.' },
          { stepNumber: 6, text: 'Add okra and gindungo, cook for another 15 minutes.' },
          { stepNumber: 7, text: 'Serve hot with funge or rice.' },
        ],
      },
    },
  });

  console.log('✅ Recipe created');

  // Create some calendar events
  await prisma.event.createMany({
    data: [
      {
        title: 'Family Dinner',
        description: 'Monthly family gathering',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        category: 'OTHER',
        creatorId: household.creatorId,
        householdId: household.id,
      },
      {
        title: 'School Meeting',
        description: 'Parent-teacher conference',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
        category: 'SCHOOL',
        location: 'Escola Primária Central',
        creatorId: household.creatorId,
        householdId: household.id,
      },
    ],
  });

  console.log('✅ Calendar events created');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\nDemo accounts:');
  console.log('  Admin: admin@household.com / admin123');
  console.log('  Member: member@household.com / member123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
