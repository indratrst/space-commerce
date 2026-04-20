"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";

export function StorefrontUI({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide Header, Footer, and CartDrawer for admin and login routes
  const isExcludedPath = pathname?.startsWith("/admin") || pathname === "/login";

  if (isExcludedPath) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
