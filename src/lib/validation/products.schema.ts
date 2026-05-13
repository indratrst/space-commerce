import { z } from "zod";

// ─── Variant Schema ─────────────────────────────────────────
// const ProductVariantBaseSchema = {
//   id: z.string().optional(),
//   size: z.enum(["S", "M", "L", "XL", "XXL", "One Size"]),
//   color: z.string().default(""),
//   stock: z.number().int().min(0, "Stock minimal 0"),
//   isDeleted: z.boolean().optional(),
// };

// export const ProductVariantSchema = z.object(ProductVariantBaseSchema);

// // ─── Product Schema ─────────────────────────────────────────
// const ProductBaseSchema = {
//   title: z.string().min(1, "Judul produk wajib diisi"),
//   price: z
//     .number({ message: "Harga wajib diisi" })
//     .int("Harga harus bilangan bulat")
//     .positive("Harga harus lebih dari 0"),
//   description: z.string().min(1, "Deskripsi wajib diisi"),
//   image: z.string().default(""),
//   categoryId: z.string().min(1, "Kategori wajib dipilih"),
//   variants: z
//     .array(z.object(ProductVariantBaseSchema))
//     .refine(
//       (variants) => variants.filter((v) => !v.isDeleted).length > 0,
//       "Minimal 1 variant harus ada"
//     ),
// };

// CREATE schema
// export const CreateProductSchema = z.object({
//   ...ProductBaseSchema,
// });

// // UPDATE schema
// export const UpdateProductSchema = z
//   .object({
//     id: z.union([z.string(), z.number()]),
//     ...ProductBaseSchema,
//   })
//   .partial();

// // RESPONSE schema
// export const ProductResponseSchema = z.object({
//   id: z.union([z.string(), z.number()]),
//   title: z.string(),
//   price: z.number(),
//   description: z.string(),
//   category: z.string(),
//   image: z.string().optional(),
//   rating: z
//     .object({
//       rate: z.number(),
//       count: z.number(),
//     })
//     .optional(),
// });

// ─── Inferred Types ─────────────────────────────────────────
// export type ProductVariant = z.infer<typeof ProductVariantSchema>;
// export type CreateProduct = z.infer<typeof CreateProductSchema>;
// export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
// export type ProductResponse = z.infer<typeof ProductResponseSchema>;

const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, "Size wajib diisi"),
  color: z.string().default(""),
  stock: z.number().int().min(0, "Stock minimal 0"),
  isDeleted: z.boolean().optional(),
});

const productSchema = z.object({
  title: z.string().min(1, "Judul produk wajib diisi"),
  price: z
    .number({ message: "Harga wajib diisi" })
    .int("Harga harus bilangan bulat")
    .positive("Harga harus lebih dari 0"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  image: z.string().default(""),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  variants: z
    .array(variantSchema)
    .refine(
      (variants) => variants.filter((v) => !v.isDeleted).length > 0,
      "Minimal 1 variant harus ada",
    ),
});
export type ProductFormValidation = z.infer<typeof productSchema>;
