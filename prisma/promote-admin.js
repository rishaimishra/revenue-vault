const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  
  if (!email) {
    console.error('Please specify an email address:');
    console.error('  node prisma/promote-admin.js user@example.com');
    process.exit(1);
  }

  console.log(`Searching for user with email: ${email}...`);
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`User ${email} does not exist. Creating a new admin user...`);
    const newAdmin = await prisma.user.create({
      data: {
        email,
        name: email.split('@')[0],
        role: 'ADMIN',
        isVerified: true,
        isOnboarded: true,
      },
    });
    console.log(`Successfully created and promoted new ADMIN:`, newAdmin);
  } else {
    console.log(`User found! Current role: ${user.role}. Upgrading to ADMIN...`);
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: 'ADMIN',
        isVerified: true,
        isOnboarded: true,
      },
    });
    console.log(`Successfully promoted ${email} to ADMIN!`, updatedUser);
  }
}

main()
  .catch((e) => {
    console.error('Error promoting user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
