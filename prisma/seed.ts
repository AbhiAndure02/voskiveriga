import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialProducts = [
  {
    name: 'Voskiveriga AquaShield Home',
    slug: 'voskiveriga-aquashield-home',
    sku: 'VK-AQSH-01',
    description:
      'Next-Gen Salt-Free Electromagnetic Hard Water Descaler for whole-house pipe protection up to 1.25 inches. Stops limescale buildup in taps, geysers, and appliances without salt or water wastage.',
    shortDescription: 'Whole-house salt-free hard water descaler (1/2" to 1.25" pipes)',
    category: 'Descalers',
    brand: 'Voskiveriga',
    images: ['/images/logo.jpeg'],
    price: 8999,
    mrp: 14999,
    tax: 18,
    gst: 18,
    stock: 25,
    isFeatured: true,
    specifications: {
      create: [
        { key: 'Pipe Size Compatibility', value: '1/2" to 1.25" Main Water Supply Lines' },
        { key: 'TDS Support', value: 'Up to 2500 PPM' },
        { key: 'Power Consumption', value: '5W Ultra-Low Energy' },
        { key: 'Warranty', value: '5-Year Replacement Warranty' },
        { key: 'Maintenance', value: '100% Salt-Free & Zero Maintenance' },
      ],
    },
  },
  {
    name: 'Voskiveriga AquaShield Pro Commercial',
    slug: 'voskiveriga-aquashield-pro-commercial',
    sku: 'VK-AQSP-02',
    description:
      'High-capacity dual-band commercial descaler designed for multi-story apartments, hotels, and industrial boilers up to 3-inch main lines.',
    shortDescription: 'Heavy-duty commercial descaler for large buildings and 2-3" pipes',
    category: 'Commercial',
    brand: 'Voskiveriga',
    images: ['/images/logo.jpeg'],
    price: 18999,
    mrp: 27999,
    tax: 18,
    gst: 18,
    stock: 15,
    isFeatured: true,
    specifications: {
      create: [
        { key: 'Pipe Size Compatibility', value: '1.5" to 3.0" Commercial Lines' },
        { key: 'TDS Support', value: 'Up to 3500 PPM' },
        { key: 'Power Consumption', value: '12W' },
        { key: 'Warranty', value: '5-Year Warranty' },
      ],
    },
  },
];

async function main() {
  console.log('Seeding products to PostgreSQL database via Prisma...');

  for (const prod of initialProducts) {
    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (existing) {
      console.log(`Product "${prod.name}" already exists in PostgreSQL.`);
      continue;
    }

    const created = await prisma.product.create({
      data: prod,
      include: { specifications: true },
    });

    console.log(`Created product in PostgreSQL: ${created.name} (${created.id})`);
  }

  console.log('Product seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
