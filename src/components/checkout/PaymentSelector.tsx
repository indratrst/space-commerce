"use client";

import { useState } from "react";
import { CreditCard, Wallet, Landmark, QrCode } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "bca_va", name: "BCA Virtual Account", icon: Landmark, type: "VA" },
  { id: "bni_va", name: "BNI Virtual Account", icon: Landmark, type: "VA" },
  { id: "mandiri_va", name: "Mandiri Virtual Account", icon: Landmark, type: "VA" },
  { id: "gopay", name: "GoPay", icon: Wallet, type: "E-Wallet" },
  { id: "ovo", name: "OVO", icon: Wallet, type: "E-Wallet" },
  { id: "qris", name: "QRIS", icon: QrCode, type: "QR" },
  { id: "credit_card", name: "Credit / Debit Card", icon: CreditCard, type: "Card" },
];

interface PaymentSelectorProps {
  onSelect: (methodId: string) => void;
}

export function PaymentSelector({ onSelect }: PaymentSelectorProps) {
  const [selectedId, setSelectedId] = useState("");

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelect(id);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
        <CreditCard className="h-4 w-4" /> Payment Method
      </h3>
      
      <div className="grid grid-cols-1 gap-2">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedId === method.id;
          const Icon = method.icon;
          return (
            <label
              key={method.id}
              className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${
                isSelected ? "bg-black text-white border-black" : "bg-surface border-transparent hover:border-gray-300"
              }`}
              onClick={() => handleSelect(method.id)}
            >
              <input
                type="radio"
                className="hidden"
                checked={isSelected}
                readOnly
              />
              <Icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
              <div className="flex-1">
                <p className="text-sm font-bold uppercase">{method.name}</p>
                <p className={`text-[10px] ${isSelected ? "text-gray-300" : "text-muted-foreground"}`}>
                  {method.type}
                </p>
              </div>
              {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
            </label>
          );
        })}
      </div>
    </div>
  );
}
