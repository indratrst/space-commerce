"use client";

import { useEffect, useState } from "react";
import { getRajaOngkirProvinces, getRajaOngkirCities, getRajaOngkirDistricts, calculateRates, findMatch } from "@/services/rajaongkir";
import { ShippingRate, BillingAddress } from "@/types/checkout";
import { Truck, Loader2 } from "lucide-react";

interface ShippingSelectorProps {
  billingData: Partial<BillingAddress>;
  items: any[];
  onSelect: (rate: ShippingRate) => void;
}

export function ShippingSelector({ billingData, items, onSelect }: ShippingSelectorProps) {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRateCode, setSelectedRateCode] = useState<string>("");
  
  const COURIERS = "jne:sicepat:pos:tiki:jnt";

  useEffect(() => {
    if (billingData.province_name && billingData.city_name && billingData.district_name) {
      const fetchROData = async () => {
        setLoading(true);
        try {
          // 1. Get RO Province ID
          const roProvinces = await getRajaOngkirProvinces();
          const roProvince = findMatch(roProvinces, billingData.province_name!, "name");
          
          if (roProvince) {
            // 2. Get RO City ID
            const roCities = await getRajaOngkirCities(roProvince.id);
            const roCity = findMatch(roCities, billingData.city_name!, "name");
            
            if (roCity) {
              // 3. Get RO District ID
              const roDistricts = await getRajaOngkirDistricts(roCity.id);
              const roDistrict = findMatch(roDistricts, billingData.district_name!, "name");
              
              if (roDistrict) {
                // 4. Calculate Rates using District ID
                const totalWeight = items.reduce((acc, item) => acc + (item.quantity * 500), 0);
                const results = await calculateRates(
                  "151", // Origin: Jakarta Barat (can be changed)
                  roDistrict.id, 
                  totalWeight, 
                  COURIERS,
                  true // isDistrict
                );
                
                // Komerce structure returns a flat list of couriers/costs
                setRates(results || []);
              }
            }
          }
        } catch (error) {
          console.error("Raja Ongkir Error:", error);
        }
        setLoading(false);
      };
      fetchROData();
    }
  }, [billingData.province_name, billingData.city_name, billingData.district_name, items]);

  const handleSelect = (rate: any) => {
    const formattedRate: ShippingRate = {
      courier_name: rate.name,
      courier_code: rate.code,
      courier_service_name: rate.service,
      courier_service_code: rate.service,
      price: rate.cost,
      duration: rate.etd
    };
    setSelectedRateCode(`${rate.code}-${rate.service}`);
    onSelect(formattedRate);
  };

  if (!billingData.district_name) {
    return (
      <div className="p-6 border-2 border-dashed rounded-lg opacity-50 flex flex-col items-center justify-center text-center space-y-2" style={{ borderColor: "var(--surface-border)" }}>
        <Truck className="h-8 w-8 opacity-40" />
        <p className="text-sm">Please select a district first to see available Raja Ongkir couriers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
        <Truck className="h-4 w-4" /> Shipping Method
      </h3>
      
      {loading ? (
        <div className="flex flex-col items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin opacity-20" />
          <p className="text-xs mt-2 text-muted-foreground uppercase">Fetching rates from Raja Ongkir Komerce...</p>
        </div>
      ) : rates.length > 0 ? (
        <div className="space-y-3">
          {rates.map((rate: any, index: number) => {
            const isSelected = selectedRateCode === `${rate.code}-${rate.service}`;
            return (
              <label
                key={`${rate.code}-${rate.service}-${index}`}
                className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                  isSelected ? "bg-black text-white border-black" : "bg-surface border-transparent hover:border-gray-300"
                }`}
                onClick={() => handleSelect(rate)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-white rounded p-1 flex items-center justify-center overflow-hidden">
                     <span className="text-[10px] font-bold text-black uppercase">{rate.code}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase">{rate.service}</p>
                    <p className={`text-xs ${isSelected ? "text-gray-300" : "text-muted-foreground"}`}>
                      Estimated: {rate.etd}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-bold">
                  Rp {rate.cost.toLocaleString("id-ID")}
                </div>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="p-4 border text-center text-sm text-red-500 bg-red-50">
          No shipping methods available for this location.
        </div>
      )}
    </div>
  );
}
