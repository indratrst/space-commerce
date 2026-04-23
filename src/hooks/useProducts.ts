import { useQuery } from "@tanstack/react-query";
import { ProductWithRelations } from "@/lib/data";

export function useProducts(categorySlug?: string, search?: string) {
  return useQuery<ProductWithRelations[]>({
    queryKey: ["products", { category: categorySlug, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categorySlug) params.append("category", categorySlug);
      if (search) params.append("search", search);
      
      const queryString = params.toString();
      const url = queryString ? `/api/products?${queryString}` : "/api/products";
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
