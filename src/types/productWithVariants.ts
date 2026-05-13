// types/productWithVariants.ts
import { CreateProductSchema } from "@/lib/validation/products.schema";
import { CreateProductVariantSchema } from "@/lib/validation/productVariant.schema";
import { z } from "zod";

export const CreateProductWithVariantsSchema = z.object({
  product: CreateProductSchema,
  variants: z.array(CreateProductVariantSchema.omit({ productId: true })),
});

export type CreateProductWithVariants = z.infer<
  typeof CreateProductWithVariantsSchema
>;
