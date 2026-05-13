"use client";

import { useState } from "react";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { useRouter } from "next/navigation";
import { CreateCategory } from "@/lib/validation/category.schema";
import { useCreateCategory } from "@/hooks/useCategories";
import { CreateProductWithVariants } from "@/types/productWithVariants";

export default function NewCategoryPage() {
  const router = useRouter();

  const createCategory = useCreateCategory();
  const handleSubmit = async (data: CreateProductWithVariants) => {
    await createCategory.mutateAsync(data);
    router.push("/admin/categories");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CategoryForm onSubmit={handleSubmit} />
    </div>
  );
}
