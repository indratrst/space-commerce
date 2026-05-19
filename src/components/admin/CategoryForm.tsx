"use client";

import { useEffect } from "react";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  CreateCategory,
  CreateCategorySchema,
} from "@/lib/validation/category.schema";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

interface CategoryFormProps {
  initialData?: any;
  onSubmit: (data: CreateCategory) => void | Promise<void>;
  isLoading?: boolean;
}

export function CategoryForm({
  initialData,
  onSubmit,
  isLoading,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCategory>({
    resolver: standardSchemaResolver(CreateCategorySchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
    },
  });

  const watchedName = watch("name");

  const onFormSubmit = async (data: CreateCategory) => {
    // e.preventDefault();
    await onSubmit(data);
  };

  const onFormError = (errors: any) => {
    console.log("❌ Validation errors:", errors);
  };

  useEffect(() => {
    const slug = watchedName
      ?.toLowerCase()
      .trim()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    setValue("slug", slug);
  }, [watchedName, setValue]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/categories"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
          {initialData ? "Edit Category" : "New Category"}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit(onFormSubmit, onFormError)}
        className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
              Category Name
            </label>
            <input
              {...register("name")}
              required
              placeholder="e.g. Bags, Shoes, Accessories..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
              Slug
            </label>
            <input
              required
              placeholder="e.g. bags, shoes, accessories..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-xs text-red-500">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Brief description of this category..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {initialData ? "Update Category" : "Save Category"}
                {!initialData && <Plus className="w-5 h-5" />}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
