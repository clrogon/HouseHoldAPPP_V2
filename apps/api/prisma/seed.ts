import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://household:household_secret@localhost:5432/household_db?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed (clean UAT)...');

  // Create admin user with household
  const adminPassword = await bcrypt.hash('admin123', 10);

  const household = await prisma.household.create({
    data: {
      name: 'My Household',
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

  // Create default inventory categories (empty)
  await prisma.inventoryCategory.createMany({
    data: [
      { name: 'Pantry', icon: 'package', color: '#8B4513', householdId: household.id },
      { name: 'Refrigerator', icon: 'snowflake', color: '#4169E1', householdId: household.id },
      { name: 'Freezer', icon: 'thermometer', color: '#00CED1', householdId: household.id },
      { name: 'Cleaning', icon: 'spray', color: '#32CD32', householdId: household.id },
      { name: 'Bathroom', icon: 'bath', color: '#9370DB', householdId: household.id },
    ],
  });

  console.log('✅ Default inventory categories created');

  console.log('\n🎉 Clean UAT database seed completed!');
  console.log('\nLogin credentials:');
  console.log('  Email: admin@household.com');
  console.log('  Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
