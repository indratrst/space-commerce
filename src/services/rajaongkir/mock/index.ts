// services/rajaongkir/mock/index.ts

import { MOCK_LOCATIONS } from "./data";
import { LocationResult, RajaOngkirRate } from "@/types/rajaongkir";
import { mockCalculateResponse, mockSearchResponse } from "./response";

// Flag untuk mock mode (bisa dari env atau runtime)
let USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

console.log("🎭 [Mock] Mock service loaded, USE_MOCK =", USE_MOCK);

export const setMockMode = (enabled: boolean) => {
  console.log("🎭 [Mock] Setting mock mode to:", enabled);
  USE_MOCK = enabled;
};

export const isMockMode = () => {
  return USE_MOCK;
};

export const mockSearchLocations = async (
  keyword: string,
): Promise<LocationResult[]> => {
  console.log("🎭 [Mock] searchLocations called with:", keyword);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const response = mockSearchResponse(keyword);

  return response.data.map((item) => ({
    id: item.id,
    label: item.label,
    province_name: item.province_name,
    city_name: item.city_name,
    district_name: item.district_name,
    subdistrict_name: item.subdistrict_name,
    zip_code: item.zip_code,
    type: item.district_name ? "district" : "city",
  }));
};

export const mockCalculateRates = async (
  originId: string,
  destinationId: string,
  weight: number,
  courier: string,
): Promise<RajaOngkirRate[]> => {
  console.log("🎭 [Mock] calculateRates called:", {
    originId,
    destinationId,
    weight,
    courier,
  });

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const response = mockCalculateResponse(
    originId,
    destinationId,
    weight,
    courier,
  );
  return response.data;
};

// Helper: Get location by ID
export const getMockLocationById = (id: string) => {
  return MOCK_LOCATIONS.find((loc) => loc.id === id);
};

// Helper: Get all unique provinces from mock data
export const getMockProvinces = () => {
  const provinces = new Set(MOCK_LOCATIONS.map((loc) => loc.province_name));
  return Array.from(provinces);
};

// Re-export mock data
export { MOCK_LOCATIONS, mockSearchResponse, mockCalculateResponse };
