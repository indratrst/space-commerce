import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create default users
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "superuser@admin.com" },
    update: {},
    create: {
      email: "superuser@admin.com",
      name: "Super User",
      password: hashedPassword,
      role: "SUPERUSER",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@admin.com" },
    update: {},
    create: {
      email: "user@admin.com",
      name: "Standard User",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("✅ Default users created");

  // Create categories
  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: {
      name: "Clothing",
      slug: "clothing",
      description: "T-shirts, pants, hoodies, jackets, and more.",
    },
  });

  const bags = await prisma.category.upsert({
    where: { slug: "bags" },
    update: {},
    create: {
      name: "Bags",
      slug: "bags",
      description: "Daily bags, tote bags, crossbody bags.",
    },
  });

  const accessories = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: {
      name: "Accessories",
      slug: "accessories",
      description: "Caps, belts, and other accessories.",
    },
  });

  const specialEdition = await prisma.category.upsert({
    where: { slug: "special-edition" },
    update: {},
    create: {
      name: "Special Edition",
      slug: "special-edition",
      description: "Limited edition and collaboration items.",
    },
  });

  console.log("✅ Categories created");

  // Define products with their category mappings
  const productsData = [
    {
      title: "Wellborn Fukazi LS T-shirt Dark Grey",
      price: 189000,
      description: "Classic long sleeve t-shirt with premium cotton material.",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.8,
      ratingCount: 124,
      categoryId: clothing.id,
      sizes: ["S", "M", "L", "XL"],
    },
    {
      title: "Wellborn Solace Track Pants Black",
      price: 250000,
      description: "Comfortable track pants for daily wear.",
      image: "https://images.unsplash.com/photo-1718252540511-e958742e4165?q=80&w=880&auto=format&fit=crop",
      ratingRate: 4.6,
      ratingCount: 85,
      categoryId: clothing.id,
      sizes: ["S", "M", "L", "XL"],
    },
    {
      title: "Wellborn Rough & Tough Daily Bag",
      price: 320000,
      description: "Durable daily bag for all your essentials.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.9,
      ratingCount: 210,
      categoryId: bags.id,
      sizes: ["One Size"],
    },
    {
      title: "Wellborn Utility Denim Long Pants Blue",
      price: 380000,
      description: "Stylish utility denim pants with multiple pockets.",
      image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.7,
      ratingCount: 65,
      categoryId: clothing.id,
      sizes: ["28", "30", "32", "34"],
    },
    {
      title: "Wellborn Autumn Paisley Tote Bag",
      price: 150000,
      description: "Lightweight tote bag featuring aesthetic paisley patterns.",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.5,
      ratingCount: 42,
      categoryId: bags.id,
      sizes: ["One Size"],
    },
    {
      title: "Retro Sparks Black & White Cap",
      price: 120000,
      description: "Vintage style cap with spark embroidery.",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.4,
      ratingCount: 98,
      categoryId: accessories.id,
      sizes: ["One Size"],
    },
    {
      title: "Wellborn Four Elements Oversized Jersey",
      price: 210000,
      description: "Oversized jersey made with breathable mesh fabric.",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.8,
      ratingCount: 150,
      categoryId: clothing.id,
      sizes: ["M", "L", "XL", "XXL"],
    },
    {
      title: "Wellborn Stereo Crossbody Phone Bag",
      price: 145000,
      description: "Compact bag suitable to carry your phone and cards securely.",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.6,
      ratingCount: 77,
      categoryId: bags.id,
      sizes: ["One Size"],
    },
    {
      title: "Heavyweight Boxy Hoodie Black",
      price: 450000,
      description: "Premium heavyweight hoodie with a boxy oversized fit.",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.9,
      ratingCount: 320,
      categoryId: clothing.id,
      sizes: ["S", "M", "L", "XL"],
    },
    {
      title: "Vintage Washed Denim Jacket",
      price: 550000,
      description: "Classic denim jacket with a vintage wash finish.",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.8,
      ratingCount: 154,
      categoryId: clothing.id,
      sizes: ["S", "M", "L", "XL"],
    },
    {
      title: "Utility Chest Rig Bag",
      price: 280000,
      description: "Tactical chest rig for your daily essentials.",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.5,
      ratingCount: 89,
      categoryId: accessories.id,
      sizes: ["One Size"],
    },
    {
      title: "Industrial Webbed Belt Black",
      price: 180000,
      description: "Durable industrial belt with matte black buckle.",
      image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.6,
      ratingCount: 210,
      categoryId: accessories.id,
      sizes: ["One Size"],
    },
    {
      title: "10th Anniversary Varsity Jacket",
      price: 850000,
      description: "Limited edition varsity jacket to celebrate our 10th year.",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
      ratingRate: 5.0,
      ratingCount: 45,
      categoryId: specialEdition.id,
      sizes: ["S", "M", "L", "XL"],
    },
    {
      title: "Limited Artist Collab Graphic Tee",
      price: 280000,
      description: "Special edition graphic tee in collaboration with local artists.",
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop",
      ratingRate: 4.9,
      ratingCount: 120,
      categoryId: specialEdition.id,
      sizes: ["S", "M", "L", "XL"],
    },
  ];

  for (const productData of productsData) {
    const { sizes, ...data } = productData;

    const product = await prisma.product.create({
      data,
    });

    // Create variants (stock) for each size
    for (const size of sizes) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          size,
          stock: Math.floor(Math.random() * 50) + 10, // Random stock 10-59
        },
      });
    }

    console.log(`  ✅ Product seeded: ${product.title}`);
  }

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
