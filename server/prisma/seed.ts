import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  const electronicsCategory = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and accessories',
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
    },
  });

  const booksCategory = await prisma.category.upsert({
    where: { slug: 'books' },
    update: {},
    create: {
      name: 'Books',
      slug: 'books',
      description: 'Books and educational materials',
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  // Create customer user
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.CUSTOMER,
    },
  });

  // Create seller user
  const sellerPassword = await bcrypt.hash('seller123', 10);
  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      password: sellerPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.SELLER,
    },
  });

  // Create sample products
  const products = [
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Latest iPhone with advanced camera system',
      price: 999.99,
      comparePrice: 1099.99,
      sku: 'IPH15P-128',
      quantity: 50,
      categoryId: electronicsCategory.id,
      images: ['https://example.com/iphone15pro1.jpg', 'https://example.com/iphone15pro2.jpg'],
    },
    {
      name: 'MacBook Air M2',
      slug: 'macbook-air-m2',
      description: 'Lightweight laptop with M2 chip',
      price: 1199.99,
      comparePrice: 1299.99,
      sku: 'MBA-M2-256',
      quantity: 25,
      categoryId: electronicsCategory.id,
      images: ['https://example.com/macbookair1.jpg'],
    },
    {
      name: 'Cotton T-Shirt',
      slug: 'cotton-t-shirt',
      description: 'Comfortable cotton t-shirt',
      price: 19.99,
      comparePrice: 24.99,
      sku: 'CT-001-M',
      quantity: 100,
      categoryId: clothingCategory.id,
      images: ['https://example.com/tshirt1.jpg'],
    },
    {
      name: 'JavaScript: The Good Parts',
      slug: 'javascript-good-parts',
      description: 'Essential JavaScript programming book',
      price: 29.99,
      comparePrice: 39.99,
      sku: 'JS-GP-001',
      quantity: 200,
      categoryId: booksCategory.id,
      images: ['https://example.com/jsbook1.jpg'],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  // Create user profiles
  await prisma.userProfile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      bio: 'System administrator',
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
      bio: 'Regular customer',
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      bio: 'Product seller',
    },
  });

  // Create sample addresses
  await prisma.address.create({
    data: {
      userId: customerUser.id,
      title: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      isDefault: true,
    },
  });

  console.log('✅ Database seeding completed!');
  console.log('📧 Admin credentials: admin@example.com / admin123');
  console.log('📧 Customer credentials: customer@example.com / customer123');
  console.log('📧 Seller credentials: seller@example.com / seller123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
