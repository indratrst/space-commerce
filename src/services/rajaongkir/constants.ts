// services/rajaongkir/constants.ts

// TODO: Update with your store's actual district ID
export const STORE_CONFIG = {
  originDistrictId: process.env.NEXT_PUBLIC_STORE_ORIGIN_ID || "21001",
  originPostalCode: process.env.NEXT_PUBLIC_STORE_POSTAL_CODE || "40132",
} as const;

export const SUPPORTED_COURIERS = [
  { code: "jne", label: "JNE" },
  { code: "jnt", label: "J&T" },
  { code: "sicepat", label: "SiCepat" },
  { code: "anteraja", label: "AnterAja" },
  { code: "idexpress", label: "ID Express" },
] as const;

export const DEFAULT_COURIER = "JNE";

// ✅ Export API_BASE
export const API_BASE = "/api/rajaongkir";

export const SEARCH_CONFIG = {
  minChars: 2,
  maxResults: 15,
  debounceMs: 300,
} as const;
