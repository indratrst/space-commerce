"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group flex flex-col justify-between">
      <div className="relative aspect-3/4 w-full overflow-hidden mb-4 transition-all" style={{ background: "var(--surface)" }}>
        <Link href={`/product/${product.id}`} className="block h-full w-full cursor-pointer">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex h-full items-center justify-center" style={{ color: "var(--muted)" }}>
              No Image
            </div>
          )}
        </Link>

        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity group-hover:opacity-100 flex justify-center">
          <button
            onClick={() => addToCart(product)}
            className="bg-black text-white px-6 py-2 w-full font-medium hover:bg-gray-800 transition-colors uppercase text-sm tracking-widest shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            Add To Cart
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center text-center space-y-1">
        <Link href={`/product/${product.id}`} className="hover:underline">
          <h3
            className="text-sm font-semibold uppercase tracking-wide line-clamp-2"
            style={{ color: "var(--foreground)" }}
          >
            {product.title}
          </h3>
        </Link>
        <p className="font-medium" style={{ color: "var(--muted)" }}>
          Rp {product.price.toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
}
