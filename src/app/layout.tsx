import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { StorefrontUI } from "@/components/layout/StorefrontUI";

export const metadata: Metadata = {
  title: "Wellborn Store Mockup",
  description: "Ecommerce catalog and cart UI mockup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <CartProvider>
            <StorefrontUI>
              {children}
            </StorefrontUI>
          </CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
