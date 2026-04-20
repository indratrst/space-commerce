import { z } from "zod";

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

export const CartItemSchema = z.object({
  product: ProductSchema,
  quantity: z.number().min(1),
});

export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
