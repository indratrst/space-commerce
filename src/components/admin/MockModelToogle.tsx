// components/MockModeToggle.tsx (update)
"use client";

import { isMockMode, setMockMode } from "@/services/rajaongkir/mock";
import { useEffect, useState } from "react";

export function MockModeToggle() {
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    setIsMock(isMockMode());

    // ✅ Tambahkan ini untuk akses console (opsional)
    if (process.env.NODE_ENV === "development") {
      (window as any).isMockMode = isMockMode;
      (window as any).toggleMockMode = () => {
        const newMode = !isMockMode();
        setMockMode(newMode);
        setIsMock(newMode);
        window.location.reload();
      };
    }
  }, []);

  const toggle = () => {
    const newMode = !isMock;
    setIsMock(newMode);
    setMockMode(newMode);
    window.location.reload();
  };

  return (
    <button
      onClick={toggle}
      className={`text-xs px-3 py-1.5 rounded-full ${
        isMock
          ? "bg-yellow-500/20 text-yellow-600 border border-yellow-500/50"
          : "bg-green-500/20 text-green-600 border border-green-500/50"
      }`}
    >
      {isMock ? "⚡ Mock" : "🌐 Live"}
    </button>
  );
}
