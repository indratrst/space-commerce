import { CartItem } from "@/types";

export const getItemStock = (item: CartItem): number => {
  return item.variant?.stock ?? 0;
};
