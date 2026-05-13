import { z } from "zod";
import { is } from "zod/locales";

// export const CategorySchema = z.object({
//   id: z.union([z.string(), z.number()]).optional(),
//   name: z.string(),
//   slug: z.string().optional(),
//   description: z.string().optional(),
// });

export const ProductSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(), // Sesuai dengan format FakeStoreAPI / DummyJSON
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string().optional(),
  rating: z
    .object({
      rate: z.number(),
      count: z.number(),
    })
    .optional(),
});

export const ProductVariantSchema = z.object({
  id: z.string(),
  size: z.string(),
  color: z.string().nullable().optional(),
  stock: z.number(),
  isActive: z.boolean(),
});

export const CartItemSchema = z.object({
  product: ProductSchema,
  quantity: z.number().min(1),
  productVariantId: z.string().optional(),
  variant: ProductVariantSchema.optional(),
});

const VariantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, "Size wajib diisi"),
  color: z.string().default(""),
  stock: z.number().int().min(0, "Stock minimal 0"),
  isDeleted: z.boolean().optional(),
});

export const ProductBaseSchema = z.object({
  title: z.string().min(1, "Judul produk wajib diisi"),
  price: z
    .number({ message: "Harga wajib diisi" })
    .int("Harga harus bilangan bulat")
    .positive("Harga harus lebih dari 0"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  image: z.string().default(""),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  variants: z
    .array(VariantSchema)
    .refine(
      (variants) => variants.filter((v) => !v.isDeleted).length > 0,
      "Minimal 1 variant harus ada",
    ),
});
// export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type ProductBaseSchema = z.infer<typeof ProductBaseSchema>;
