import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Find the category by slug
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const categoryProducts = await getProducts(slug);

  // Map products to the shape ProductCard expects
  const mappedProducts = categoryProducts.map((p: any) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category.name,
    image: p.image ?? undefined,
    rating: {
      rate: p.ratingRate ?? 0,
      count: p.ratingCount ?? 0,
    },
  }));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col items-center mb-10">
        <h1
          className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-center"
          style={{ color: "var(--foreground)" }}
        >
          {category.name}
        </h1>
        <div
          className="h-1 w-24 mt-6"
          style={{ background: "var(--foreground)" }}
        ></div>
      </div>

      {mappedProducts.length === 0 ? (
        <div className="text-center font-bold tracking-widest uppercase mt-20" style={{ color: "var(--muted)" }}>
          No products found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {mappedProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
