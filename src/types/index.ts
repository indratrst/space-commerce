import { z } from "zod";
import { is } from "zod/locales";

export const CategorySchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export const ProductSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(), // Sesuai dengan format FakeStoreAPI / DummyJSON
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string().url().optional(),
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

export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
