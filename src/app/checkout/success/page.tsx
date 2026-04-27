"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Generate a random order number for the mockup
    setOrderNumber(`ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, "0")}`);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-green-50 text-green-600 p-4 rounded-full mb-6">
        <CheckCircle className="h-16 w-16" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter mb-4">
        Payment Successful
      </h1>
      
      <p className="text-muted-foreground max-w-md mb-2">
        Thank you for your purchase! Your order has been placed and is being processed.
      </p>
      
      <div className="bg-surface p-4 rounded mb-10 w-full max-w-sm">
        <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Order Number</p>
        <p className="text-xl font-mono font-bold">{orderNumber}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link 
          href="/products" 
          className="flex-1 bg-black text-white py-4 px-8 uppercase font-bold text-sm tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
        <Link 
          href="/" 
          className="flex-1 border-2 border-black py-4 px-8 uppercase font-bold text-sm tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-4 w-4" /> Back Home
        </Link>
      </div>
    </div>
  );
}
