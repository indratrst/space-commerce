import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateProduct,
  ProductResponse,
} from "@/lib/validation/products.schema";

// export function useProducts(categorySlug?: string, search?: string) {
//   return useQuery<ProductWithRelations[]>({
//     queryKey: ["products", { category: categorySlug, search }],
//     queryFn: async () => {
//       const params = new URLSearchParams();
//       if (categorySlug) params.append("category", categorySlug);
//       if (search) params.append("search", search);

//       const queryString = params.toString();
//       const url = queryString
//         ? `/api/products?${queryString}`
//         : "/api/products";

//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     gcTime: 30 * 60 * 1000, // 30 minutes
//   });
// }

export function useProducts() {
  return useQuery<ProductResponse[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useProduct(id: string) {
  return useQuery<ProductResponse>({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
    enabled: !!id, // Hanya jalan kalau ada id
  });
}

// Mutation hook - create product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProduct) => {
      console.log(data, "data");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      // Optional: juga invalidate categories karena bisa affect category stats
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// Mutation hook - update product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateProduct>;
    }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", variables.id] });
    },
  });
}

// Mutation hook - delete product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
