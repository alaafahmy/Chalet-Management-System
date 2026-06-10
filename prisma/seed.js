const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'مدير النظام',
      username: 'admin',
      password: 'admin123', // Raw password for demo purposes
      role: 'admin',
      roleAr: 'مدير عام',
    },
  });
  console.log(`Created admin user with id: ${admin.id}`);

  // Create a sample chalet
  const chalet1 = await prisma.chalet.upsert({
    where: { id: 'CH-001' },
    update: {},
    create: {
      id: 'CH-001',
      name: 'شاليه النخيل',
      type: 'كبير',
      pricePerNight: 1500,
      status: 'متاح',
      description: 'شاليه فاخر مع مسبح خاص وحديقة واسعة',
      colorIndex: 2,
    },
  });
  console.log(`Created chalet with id: ${chalet1.id}`);

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
