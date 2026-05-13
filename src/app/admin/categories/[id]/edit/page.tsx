"use client";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCategory, useUpdateCategory } from "@/hooks/useCategories";
import { UpdateCategory } from "@/lib/validation/category.schema";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const { data: category, isLoading: categoryLoading } =
    useCategory(categoryId);

  const updateCategory = useUpdateCategory();
  const handleSubmit = async (data: UpdateCategory) => {
    await updateCategory.mutateAsync({ id: categoryId, data });
    router.push("/admin/categories");
  };

  if (categoryLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!category) return <div>Category not found</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CategoryForm
        initialData={category || []}
        onSubmit={handleSubmit}
        isLoading={updateCategory.isPending}
      />
    </div>
  );
}
