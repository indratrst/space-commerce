// services/rajaongkir/mock/responses.ts

import { MOCK_LOCATIONS } from "./data";

// Format response persis seperti RajaOngkir
export const mockSearchResponse = (search: string) => {
  const filtered = MOCK_LOCATIONS.filter(
    (loc) =>
      loc.label.toLowerCase().includes(search.toLowerCase()) ||
      loc.city_name?.toLowerCase().includes(search.toLowerCase()) ||
      loc.district_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return {
    meta: {
      code: 200,
      status: "success",
    },
    data: filtered.slice(0, 15).map((loc) => ({
      id: loc.id,
      label: loc.label,
      province_name: loc.province_name,
      city_name: loc.city_name,
      district_name: loc.district_name,
      subdistrict_name: loc.subdistrict_name,
      zip_code: loc.zip_code,
    })),
  };
};

// Mock ongkir response
export const mockCalculateResponse = (
  origin: string,
  destination: string,
  weight: number,
  courier: string,
) => {
  // Generate random price based on distance simulation
  const randomPrice = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  const courierServices: Record<
    string,
    Array<{ service: string; etd: string; priceRange: [number, number] }>
  > = {
    jne: [
      { service: "REG", etd: "2-3 hari", priceRange: [15000, 50000] },
      { service: "YES", etd: "1-2 hari", priceRange: [25000, 75000] },
      { service: "OKE", etd: "3-4 hari", priceRange: [10000, 35000] },
    ],
    jnt: [
      { service: "REG", etd: "2-3 hari", priceRange: [12000, 45000] },
      { service: "EZ", etd: "1-2 hari", priceRange: [20000, 60000] },
    ],
    sicepat: [
      { service: "REG", etd: "2-3 hari", priceRange: [13000, 40000] },
      { service: "BEST", etd: "1-2 hari", priceRange: [22000, 55000] },
      { service: "GOKIL", etd: "3-4 hari", priceRange: [10000, 30000] },
    ],
    anteraja: [
      { service: "REG", etd: "2-4 hari", priceRange: [11000, 38000] },
      { service: "SAME DAY", etd: "1 hari", priceRange: [50000, 150000] },
    ],
    idexpress: [
      { service: "REG", etd: "2-3 hari", priceRange: [12000, 42000] },
      { service: "ECO", etd: "3-5 hari", priceRange: [8000, 25000] },
    ],
  };

  const services = courierServices[courier] || courierServices.jne;
  const weightFactor = Math.ceil(weight / 1000); // charge per kg

  return {
    meta: {
      code: 200,
      status: "success",
    },
    data: services.map((s) => ({
      courier_code: courier,
      courier_name: courier.toUpperCase(),
      courier_service_code: s.service,
      courier_service_name: s.service,
      price: randomPrice(s.priceRange[0], s.priceRange[1]) * weightFactor,
      duration: s.etd,
      etd: s.etd,
      service: s.service,
    })),
  };
};
