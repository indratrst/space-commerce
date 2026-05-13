"use client";

import { useState } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";
import { CreateProductWithVariants } from "@/types/productWithVariants";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: categories } = useCategories();

  // const handleSubmit = async (data: any) => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/products", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });

  //     if (!res.ok) throw new Error("Failed to create product");

  //     router.push("/admin/products");
  //     router.refresh();
  //   } catch (error) {
  //     console.error("Error creating product:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const createProduct = useCreateProduct();
  const handleSubmit = async (data: CreateProductWithVariants) => {
    console.log("Submitting data:", data);
    await createProduct.mutateAsync(data);
    router.push("/admin/products");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ProductForm
        onSubmit={handleSubmit}
        isLoading={loading}
        categories={categories || []}
      />
    </div>
  );
}
