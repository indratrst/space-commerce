import { getProducts, getCategories } from "@/lib/data";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ProductListClient } from "@/components/products/ProductListClient";
import { prisma } from "@/lib/prisma";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { category: categorySlug, search } = resolvedSearchParams;

  const queryClient = new QueryClient();

  // Prefetch products based on search params
  await queryClient.prefetchQuery({
    queryKey: ["products", { category: categorySlug, search }],
    queryFn: () => getProducts(categorySlug, search),
  });

  // Get active category name if applicable
  let categoryName = "All Products";
  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { name: true },
    });
    if (category) {
      categoryName = category.name;
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex flex-col items-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-center"
          style={{ color: "var(--foreground)" }}
        >
          {search ? `Search: ${search}` : categoryName}
        </h1>
        <div
          className="h-1 w-24 mt-6"
          style={{ background: "var(--foreground)" }}
        ></div>
        {search && (
          <p className="mt-4 text-muted-foreground font-medium uppercase tracking-widest text-sm">
            Showing results for `&quot;`{search}`&quot;`
          </p>
        )}
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductListClient
          initialCategory={categorySlug}
          initialSearch={search}
        />
      </HydrationBoundary>
    </div>
  );
}
