import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  
  // Actions
  addItem: (
    product: Product,
    quantity?: number,
    maxStock?: number,
    variant?: CartItem["variant"],
  ) => void;
  removeItem: (itemKey: string | number) => void;
  updateQuantity: (itemKey: string | number, quantity: number, maxStock?: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  
  // Getters (computed as values)
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const makeItemKey = (productId: string, variantId?: string) =>
  variantId ? `${productId}-${variantId}` : productId;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      addItem: (product, quantity = 1, maxStock, variant) => {
        const currentItems = get().items;
        const itemKey = makeItemKey(String(product.id), variant?.id);
        const existingItem = currentItems.find(
          (item) =>
            makeItemKey(String(item.product.id), item.productVariantId) ===
            itemKey,
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          const finalQuantity = maxStock !== undefined ? Math.min(newQuantity, maxStock) : newQuantity;

          set({
            items: currentItems.map((item) =>
              makeItemKey(String(item.product.id), item.productVariantId) ===
              itemKey
                ? { ...item, quantity: finalQuantity }
                : item,
            ),
          });
        } else {
          const finalQuantity = maxStock !== undefined ? Math.min(quantity, maxStock) : quantity;
          set({
            items: [
              ...currentItems,
              {
                product,
                quantity: finalQuantity,
                productVariantId: variant?.id,
                variant: variant ? { ...variant } : undefined,
              },
            ],
          });
        }

        set({ isCartOpen: true });
      },

      removeItem: (itemKey) => {
        const key = String(itemKey);
        set({
          items: get().items.filter(
            (item) =>
              makeItemKey(String(item.product.id), item.productVariantId) !==
              key,
          ),
        });
      },

      updateQuantity: (itemKey, quantity, maxStock) => {
        if (quantity < 1) {
          get().removeItem(itemKey);
          return;
        }

        const key = String(itemKey);
        const finalQuantity = maxStock !== undefined ? Math.min(quantity, maxStock) : quantity;

        set({
          items: get().items.map((item) =>
            makeItemKey(String(item.product.id), item.productVariantId) === key
              ? { ...item, quantity: finalQuantity }
              : item,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: "shopping-cart-storage", // key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
