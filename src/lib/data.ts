import { prisma } from "@/lib/prisma";

// Types that match the Prisma output (with relations)
export type ProductWithRelations = Awaited<ReturnType<typeof getProducts>>[number];
export type CategoryWithCount = Awaited<ReturnType<typeof getCategories>>[number];

export async function getProducts(categorySlug?: string) {
  return prisma.product.findMany({
    where: categorySlug
      ? { category: { slug: categorySlug } }
      : undefined,
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: true,
    },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getRecommendedProducts(excludeIds: string[], limit = 4) {
  return prisma.product.findMany({
    where: {
      id: { notIn: excludeIds },
    },
    include: {
      category: true,
      variants: true,
    },
    take: limit,
    orderBy: { ratingRate: "desc" },
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
