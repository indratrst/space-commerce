// services/rajaongkir/client.ts

import {
  CalculateRatesParams,
  LocationResult,
  RajaOngkirRate,
  ShippingRate,
} from "@/types/rajaongkir";
import { API_BASE } from "./constants";
import { isMockMode, mockCalculateRates, mockSearchLocations } from "./mock";

async function handleResponse<T>(response: Response): Promise<T | null> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `API Error (${response.status}):`,
      errorText.substring(0, 200),
    );
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    console.error("Non-JSON response:", await response.text());
    return null;
  }

  const json = await response.json();

  if (json.meta?.code !== 200) {
    console.error("API returned error:", json.meta);
    return null;
  }

  return json.data || null;
}

export async function searchLocations(
  keyword: string,
): Promise<LocationResult[]> {
  // Use mock if enabled
  if (isMockMode()) {
    return mockSearchLocations(keyword);
  }

  if (!keyword || keyword.length < 2) return [];

  try {
    const response = await fetch(
      `${API_BASE}?search=${encodeURIComponent(keyword)}&limit=15`,
    );

    const data = await handleResponse<LocationResult[]>(response);

    if (!data) return [];

    return data.map((item) => ({
      id: item.id.toString(),
      label: item.label,
      province_name: item.province_name,
      city_name: item.city_name,
      district_name: item.district_name,
      subdistrict_name: item.subdistrict_name,
      zip_code: item.zip_code,
      type: item.district_name ? "district" : "city",
    }));
  } catch (error) {
    console.error("Search locations error:", error);
    return [];
  }
}

export async function calculateRates({
  originId,
  destinationId,
  weight,
  courier,
}: CalculateRatesParams): Promise<RajaOngkirRate[]> {
  // Use mock if enabled
  let params: CalculateRatesParams;

  // Cek apakah dipanggil dengan object atau parameter terpisah
  if (typeof originId === "object") {
    // Dipanggil dengan object: calculateRates({ originId, destinationId, weight, courier })
    params = originId;
  } else {
    // Dipanggil dengan parameter terpisah: calculateRates(originId, destinationId, weight, courier)
    params = {
      originId: originId,
      destinationId: destinationId!,
      weight: weight!,
      courier: courier!,
    };
  }

  console.log("📦 calculateRates params:", params);

  if (isMockMode()) {
    return mockCalculateRates(originId, destinationId, weight, courier);
  }

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: originId,
        destination: destinationId,
        weight,
        courier,
      }),
    });

    const data = await handleResponse<RajaOngkirRate[]>(response);
    return data || [];
  } catch (error) {
    console.error("Calculate rates error:", error);
    return [];
  }
}

// Helper: Transform API response to ShippingRate format
export function transformToShippingRate(rate: RajaOngkirRate): ShippingRate {
  return {
    courier_name: rate.courier_name || rate.courier_code?.toUpperCase() || "",
    courier_code: rate.courier_code || "",
    courier_service_name: rate.courier_service_name || rate.service || "",
    courier_service_code: rate.courier_service_code || rate.service || "",
    price: rate.price || 0,
    duration: rate.duration || rate.etd || "—",
  };
}

// Re-export types
// export type {
//   LocationResult,
//   ShippingRate,
//   CalculateRatesParams,
// } from "/types/rajaongkir";
