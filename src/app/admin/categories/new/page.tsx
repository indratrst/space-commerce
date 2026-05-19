"use client";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { CreateCategory } from "@/lib/validation/category.schema";
import { useCreateCategory } from "@/hooks/useCategories";

export default function NewCategoryPage() {
  const createCategory = useCreateCategory();

  const handleSubmit = (data: CreateCategory) => {
    createCategory.mutate(data); // ✅ di page
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CategoryForm onSubmit={handleSubmit} />
    </div>
  );
}
