// hooks/useCategories.ts
import {
  CategoryResponse,
  CreateCategory,
} from "@/lib/validation/category.schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query hook
export function useCategories() {
  return useQuery<CategoryResponse[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
    staleTime: 60 * 60 * 1000,
  });
}

// Mutation hook untuk create
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategory) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create category");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate dan refetch
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// Optional: Untuk admin panel dengan count
export function useCategoriesWithStats() {
  return useQuery<(CategoryResponse & { productCount: number })[]>({
    queryKey: ["categories", "with-stats"],
    queryFn: async () => {
      const res = await fetch("/api/categories?includeStats=true");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });
}
