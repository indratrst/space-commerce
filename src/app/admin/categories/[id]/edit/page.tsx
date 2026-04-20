"use client";

import { useEffect, useState, use } from "react";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`/api/categories/${id}`);
        const data = await res.json();
        setCategory(data);
      } catch (error) {
        console.error("Failed to fetch category:", error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchCategory();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update category");

      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!category) return <div>Category not found</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CategoryForm initialData={category} onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}
