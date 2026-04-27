"use client";

import Link from "next/link";
import {
  CheckCircle,
  Clock,
  ShoppingBag,
  ArrowRight,
  CreditCard,
  Copy,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status") || "success";
  const paymentType = searchParams.get("payment_type") || "";
  const [copied, setCopied] = useState(false);

  const isPending = status === "pending";

  const handleCopy = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPaymentLabel = (type: string) => {
    const map: Record<string, string> = {
      bank_transfer: "Bank Transfer / Virtual Account",
      credit_card: "Kartu Kredit / Debit",
      gopay: "GoPay",
      shopeepay: "ShopeePay",
      qris: "QRIS",
      echannel: "Mandiri Bill",
      bca_klikbca: "BCA KlikBCA",
      bca_klikpay: "BCA KlikPay",
      cimb_clicks: "CIMB Clicks",
    };
    return map[type] || type || "—";
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center py-20">
      {/* Icon */}
      <div
        className={`p-5 rounded-full mb-6 animate-[fadeIn_0.5s_ease] ${
          isPending
            ? "bg-yellow-50 text-yellow-500 dark:bg-yellow-900/20"
            : "bg-green-50 text-green-600 dark:bg-green-900/20"
        }`}
      >
        {isPending ? (
          <Clock className="h-16 w-16" />
        ) : (
          <CheckCircle className="h-16 w-16" />
        )}
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter mb-4">
        {isPending ? "Menunggu Pembayaran" : "Pembayaran Berhasil!"}
      </h1>

      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        {isPending
          ? "Pesanan Anda sedang menunggu konfirmasi pembayaran. Selesaikan pembayaran sebelum waktu berakhir."
          : "Terima kasih atas pembelian Anda! Pesanan sedang diproses dan akan segera dikirimkan."}
      </p>

      {/* Order Info Card */}
      <div
        className="bg-surface border rounded-xl p-6 mb-10 w-full max-w-sm space-y-4 text-left"
        style={{ borderColor: "var(--surface-border)" }}
      >
        {orderId && (
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
              ID Pesanan
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono font-bold truncate flex-1">{orderId}</p>
              <button
                onClick={handleCopy}
                className="shrink-0 p-1.5 hover:bg-black/5 rounded transition-colors"
                title="Salin ID"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        )}

        {paymentType && (
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
              Metode Pembayaran
            </p>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold capitalize">
                {getPaymentLabel(paymentType)}
              </p>
            </div>
          </div>
        )}

        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
            Status
          </p>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1 rounded-full ${
              isPending
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isPending ? "bg-yellow-500" : "bg-green-500"
              }`}
            />
            {isPending ? "Pending" : "Lunas"}
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link
          href="/products"
          className="flex-1 bg-black text-white py-4 px-8 uppercase font-bold text-sm tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
        >
          Lanjut Belanja <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="flex-1 border-2 border-black py-4 px-8 uppercase font-bold text-sm tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-4 w-4" /> Beranda
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
