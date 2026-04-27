"use client";

import { useState, useEffect } from "react";
import { BillingAddress, ShippingRate } from "@/types/checkout";
import { CartItem } from "@/types";
import { Truck, Loader2, ChevronDown, RefreshCw } from "lucide-react";
import { calculateRates, findMatch } from "@/services/rajaongkir";

// Origin district ID (Bandung city area) — adjust to your store location
const ORIGIN_DISTRICT_ID = "3273010"; // Bandung Wetan as default

const COURIERS = [
  { code: "jne", label: "JNE" },
  { code: "jnt", label: "J&T" },
  { code: "sicepat", label: "SiCepat" },
  { code: "anteraja", label: "AnterAja" },
  { code: "idexpress", label: "ID Express" },
];

interface ShippingSelectorProps {
  billingData: Partial<BillingAddress>;
  items: CartItem[];
  onSelect: (rate: ShippingRate) => void;
}

export function ShippingSelector({ billingData, items, onSelect }: ShippingSelectorProps) {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedCourier, setSelectedCourier] = useState("jne");

  const totalWeight = items.reduce((sum, item) => {
    const weight = (item.product as any).weight || 500;
    return sum + weight * item.quantity;
  }, 0);

  const canCalculate = !!billingData.areaId;

  const fetchRates = async () => {
    if (!canCalculate) return;
    setLoading(true);
    setError(null);
    setRates([]);
    setSelectedIndex(null);

    try {
      const data = await calculateRates(
        ORIGIN_DISTRICT_ID,
        billingData.areaId!,
        totalWeight,
        selectedCourier,
        true // district-level
      );

      if (!data || data.length === 0) {
        setError("Tidak ada layanan pengiriman tersedia ke area ini.");
        return;
      }

      const mapped: ShippingRate[] = data.map((item: any) => ({
        courier_name: item.courier_name || selectedCourier.toUpperCase(),
        courier_code: item.courier_code || selectedCourier,
        courier_service_name: item.courier_service_name || item.service || "",
        courier_service_code: item.courier_service_code || item.service || "",
        price: item.price || 0,
        duration: item.duration || item.etd || "—",
      }));

      setRates(mapped);
    } catch (e: any) {
      setError(e.message || "Gagal memuat ongkir.");
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch when areaId or courier changes
  useEffect(() => {
    if (canCalculate) {
      fetchRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingData.areaId, selectedCourier]);

  const handleSelect = (rate: ShippingRate, idx: number) => {
    setSelectedIndex(idx);
    onSelect(rate);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
        <Truck className="h-4 w-4" /> Pilih Pengiriman
      </h3>

      {/* Courier Selector */}
      <div className="relative">
        <select
          className="w-full p-3 text-sm border-none appearance-none cursor-pointer focus:ring-1 focus:ring-foreground"
          style={{ backgroundColor: "var(--surface)", color: "var(--foreground)" }}
          value={selectedCourier}
          onChange={(e) => setSelectedCourier(e.target.value)}
          disabled={loading}
        >
          {COURIERS.map((c) => (
            <option
              key={c.code}
              value={c.code}
              style={{ backgroundColor: "var(--surface)", color: "var(--foreground)" }}
            >
              {c.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40 pointer-events-none" />
      </div>

      {/* No area selected */}
      {!canCalculate && (
        <div
          className="p-4 border border-dashed text-center text-xs text-muted-foreground uppercase tracking-wider"
          style={{ borderColor: "var(--surface-border)" }}
        >
          Pilih kecamatan tujuan terlebih dahulu
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat ongkos kirim...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="space-y-2">
          <p className="text-xs text-red-500">{error}</p>
          <button
            onClick={fetchRates}
            className="flex items-center gap-1.5 text-xs font-bold uppercase hover:opacity-70 transition-opacity"
          >
            <RefreshCw className="h-3 w-3" /> Coba lagi
          </button>
        </div>
      )}

      {/* Rate list */}
      {!loading && rates.length > 0 && (
        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
          {rates.map((rate, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={`${rate.courier_service_code}-${idx}`}
                onClick={() => handleSelect(rate, idx)}
                className={`w-full flex items-center gap-4 p-3 border text-left transition-all ${
                  isSelected
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-transparent bg-surface hover:border-gray-300"
                }`}
              >
                <Truck
                  className={`h-4 w-4 shrink-0 ${
                    isSelected ? "text-white dark:text-black" : "text-muted-foreground"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase leading-tight">
                    {rate.courier_name} — {rate.courier_service_name}
                  </p>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      isSelected ? "text-gray-300 dark:text-gray-600" : "text-muted-foreground"
                    }`}
                  >
                    Estimasi: {rate.duration}
                  </p>
                </div>
                <span className="text-xs font-black shrink-0">
                  Rp {rate.price.toLocaleString("id-ID")}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
