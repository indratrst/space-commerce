"use client";

import Link from "next/link";
import { ShoppingBag, Search, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function Header() {
  const { cart, setIsCartOpen } = useCart();

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b" style={{ background: "var(--background)", borderColor: "var(--surface-border)" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
              <span className="px-2 py-1 uppercase text-lg font-black" style={{ color: "var(--foreground)" }}>Ecommerce</span>
            </Link>

            <nav className="hidden md:ml-10 md:flex md:space-x-8" style={{ color: "var(--foreground)" }}>
              <Link href="/#new-arrivals" className="font-medium transition-colors hover:text-foreground" style={{ color: "var(--muted)" }}>
                New Arrivals
              </Link>
              <Link href="/category/clothing" className="font-medium transition-colors hover:text-foreground" style={{ color: "var(--muted)" }}>
                Clothing
              </Link>
              <Link href="/category/accessories" className="font-medium transition-colors hover:text-foreground" style={{ color: "var(--muted)" }}>
                Accessories
              </Link>
              <Link href="/category/special-edition" className="font-medium transition-colors hover:text-foreground" style={{ color: "var(--muted)" }}>
                Special Edition
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            <button style={{ color: "var(--muted)" }}>
              <Search className="h-5 w-5" />
            </button>
            <button style={{ color: "var(--muted)" }}>
              <User className="h-5 w-5" />
            </button>
            <button
              className="relative group flex items-center transition-colors"
              style={{ color: "var(--foreground)" }}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5 mr-1" />
              <span className="font-medium hidden sm:inline-block">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
