"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, ArrowLeft, Trash2, Box, Info } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "./ImageUpload";

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    price: initialData?.price || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    categoryId: initialData?.categoryId || "",
    variants: initialData?.variants
      ?.filter((v: any) => v.isActive) // 🔥 FILTER DI SINI
      .map((v: any) => ({
        id: v.id,
        size: v.size,
        stock: v.stock,
        color: v.color || "",
      })) || [{ size: "One Size", stock: 0, color: "" }],
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
        if (!formData.categoryId && data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", stock: 0, color: "" }],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];

      if (newVariants[index].id) {
        // variant lama → tandai delete
        newVariants[index] = {
          ...newVariants[index],
          isDeleted: true,
        };
      } else {
        // variant baru → boleh langsung remove
        newVariants.splice(index, 1);
      }

      return {
        ...prev,
        variants: newVariants,
      };
    });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
          {initialData ? "Edit Product" : "New Product"}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-600">
              <Info className="w-5 h-5" />
              General Information
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                Product Title
              </label>
              <input
                required
                placeholder="e.g. Classic Logo T-Shirt"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                value={formData.title ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                  Price (IDR)
                </label>
                <input
                  required
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  value={formData.price ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                  Category
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all appearance-none"
                  value={formData.categoryId ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                Description
              </label>
              <textarea
                required
                rows={6}
                placeholder="Product details and specifications..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
                value={formData.description ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-600">
                <Box className="w-5 h-5" />
                Inventory & Variants
              </h3>
              <button
                type="button"
                onClick={addVariant}
                className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {formData.variants
                .filter((v: any) => !v.isDeleted)
                .map((v: any, index: number) => (
                  <div
                    key={v.id || index}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 relative group"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Size
                      </label>
                      <input
                        placeholder="e.g. M"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        value={v.size ?? ""}
                        onChange={(e) =>
                          updateVariant(index, "size", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Color
                      </label>
                      <input
                        placeholder="Optional"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        value={v.color ?? ""}
                        onChange={(e) =>
                          updateVariant(index, "color", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Stock
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        value={v.stock ?? 0}
                        onChange={(e) =>
                          updateVariant(index, "stock", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-end justify-end">
                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="p-2 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Media */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <ImageUpload
              value={formData.image ?? ""}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 sticky top-24">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase text-slate-400 tracking-widest">
                Actions
              </h4>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>{initialData ? "Update Product" : "Publish Product"}</>
                )}
              </button>

              <Link
                href="/admin/products"
                className="w-full py-4 flex items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
