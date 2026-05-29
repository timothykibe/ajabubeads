const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const initialProducts = require('./seed-data.json');

async function seed() {
  console.log('🌱 Starting JS database seed...');
  try {
    await prisma.product.deleteMany();
    console.log('✓ Cleared existing products');

    const hashed = bcrypt.hashSync('admin123', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@ajabubeads.com' },
      update: { isAdmin: true, isSuperAdmin: true },
      create: {
        email: 'admin@ajabubeads.com',
        name: 'Admin User',
        password: hashed,
        phone: '+254 712 345 678',
        country: 'Kenya',
        isActive: true,
        isAdmin: true,
        isSuperAdmin: true,
      },
    });
    console.log('✓ Created/updated admin user:', adminUser.email);

    const created = await prisma.product.createMany({ data: initialProducts, skipDuplicates: true });
    console.log(`✓ Created ${created.count} products`);

    console.log('✅ JS Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
