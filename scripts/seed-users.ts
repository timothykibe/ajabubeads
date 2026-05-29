import { userRepository } from '@/lib/db/user.repository';

async function seedUsers(count = 50) {
  console.log(`🌱 Seeding ${count} demo users...`);
  try {
    for (let i = 1; i <= count; i++) {
      const email = `demo+${i}@ajabubeads.com`;
      const name = `Demo User ${i}`;
      const password = 'password123';

      const existing = await userRepository.findByEmail(email);
      if (existing) continue;

      await userRepository.create({ email, name, password });
      if (i % 10 === 0) console.log(`Created ${i} users`);
    }
    console.log('✅ Demo users seeding complete');
  } catch (err) {
    console.error('❌ Failed to seed users', err);
    process.exit(1);
  }
}

seedUsers(50);
