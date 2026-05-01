"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product, CartItem } from "@/types";
import { useCartStore } from "@/store/useCartStore";

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    variant?: CartItem["variant"],
    currentStock?: number,
  ) => void;
  removeFromCart: (itemKey: string | number) => void;
  updateQuantity: (itemKey: string | number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const store = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync isCartOpen with store
  const setIsCartOpen = (isOpen: boolean) => {
    store.setCartOpen(isOpen);
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    variant?: CartItem["variant"],
  ) => {
    store.addItem(product, quantity, undefined, variant);
  };

  const removeFromCart = (itemKey: string | number) => {
    store.removeItem(itemKey);
  };

  const updateQuantity = (itemKey: string | number, quantity: number) => {
    store.updateQuantity(itemKey, quantity);
  };

  const clearCart = () => {
    store.clearCart();
  };

  const cartTotal = store.getTotalPrice();

  // Prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        cart: store.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen: store.isCartOpen,
        setIsCartOpen,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
