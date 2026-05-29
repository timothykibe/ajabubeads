const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedUsers(count = 50) {
  console.log(`🌱 Seeding ${count} demo users...`);
  try {
    for (let i = 1; i <= count; i++) {
      const email = `demo+${i}@ajabubeads.com`;
      const name = `Demo User ${i}`;
      const password = 'password123';

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) continue;

      const hashed = bcrypt.hashSync(password, 10);
      await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          password: hashed,
        },
      });
      if (i % 10 === 0) console.log(`Created ${i} users`);
    }
    console.log('✅ Demo users seeding complete');
  } catch (err) {
    console.error('❌ Failed to seed users', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers(50).catch((err) => {
  console.error(err);
  process.exit(1);
});
