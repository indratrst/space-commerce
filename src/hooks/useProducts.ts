import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateProduct,
  ProductResponse,
  UpdateProduct,
} from "@/lib/validation/products.schema";
import { ProductWithRelations } from "@/lib/data";
import api from "@/lib/axios";

// export function useProductUnique(categorySlug?: string, search?: string) {
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

export function useProductUnique(categorySlug?: string, search?: string) {
  return useQuery<ProductWithRelations[]>({
    queryKey: ["products", { category: categorySlug, search }],
    queryFn: async () => {
      const { data } = await api.get<ProductWithRelations[]>("/api/products", {
        params: {
          ...(categorySlug && { category: categorySlug }),
          ...(search && { search }),
        },
      });

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useProducts() {
  return useQuery<ProductResponse[]>({
    queryKey: ["products"],
    queryFn: () => api.get(`products`).then((res) => res.data),
    staleTime: 60 * 60 * 1000,
  });
}

// export function useCategory(id: string) {
//   return useQuery<CategoryResponse>({
//     queryKey: ["categories", id],
//     enabled: !!id, // Hanya jalan kalau ada id
//     queryFn: () => api.get(`/api/products`).then((res) => res.data),
//   });
// }

// export function useProduct(id: string) {
//   return useQuery<ProductResponse>({
//     queryKey: ["products", id],
//     queryFn: async () => {
//       const res = await fetch(`/api/products/${id}`);
//       if (!res.ok) throw new Error("Failed to fetch product");
//       return res.json();
//     },
//     enabled: !!id, // Hanya jalan kalau ada id
//   });
// }

export function useProduct(id: string) {
  return useQuery<ProductResponse>({
    queryKey: ["products", id],
    enabled: !!id, // Hanya jalan kalau ada id
    queryFn: () => api.get(`products/${id}`).then((res) => res.data),
  });
}

// Mutation hook - create product
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProduct) =>
      // console.log(data, "data");
      // const res = await fetch("/api/products", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });

      // if (!res.ok) throw new Error("Failed to create product");
      // return res.json();

      api.post("/products", data).then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
      data: Partial<UpdateProduct>;
    }) => {
      const res = await api.put(`/products/${id}`, data);
      return res.data;
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
      const res = await api.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
