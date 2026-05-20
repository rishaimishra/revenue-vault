import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a seller
  const seller = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      name: 'John Seller',
      role: 'SELLER',
      isVerified: true,
    },
  })

  // Create a buyer
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      name: 'Jane Buyer',
      role: 'BUYER',
    },
  })

  // Create dummy listings
  // Using create instead of createMany to avoid type issues with schema changes not being fully picked up by createMany types yet
  await prisma.startupListing.create({
    data: {
      sellerId: seller.id,
      title: 'AI Analytics SaaS',
      description: 'A cutting-edge AI platform for analytics.',
      revenue: 100000,
      profit: 30000,
      price: 250000,
      category: 'SaaS',
      status: 'PUBLISHED',
      tagline: 'Analytics redefined.',
    },
  })

  await prisma.startupListing.create({
    data: {
      sellerId: seller.id,
      title: 'Organic E-commerce Store',
      description: 'A booming organic health store.',
      revenue: 50000,
      profit: 15000,
      price: 100000,
      category: 'E-commerce',
      status: 'PENDING_APPROVAL',
      tagline: 'Healthy living, simple.',
    },
  })

  console.log('Seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
