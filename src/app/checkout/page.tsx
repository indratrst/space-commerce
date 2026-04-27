"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { ShippingSelector } from "@/components/checkout/ShippingSelector";
import { PaymentSelector } from "@/components/checkout/PaymentSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentConfirmationModal } from "@/components/checkout/PaymentConfirmationModal";
import { BillingAddress, ShippingRate } from "@/types/checkout";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [billingData, setBillingData] = useState<Partial<BillingAddress>>({});
  const [shippingRate, setShippingRate] = useState<ShippingRate | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalAmount = cartTotal + (shippingRate?.price || 0);

  const isFormValid = 
    billingData.firstName && 
    billingData.lastName && 
    billingData.email && 
    billingData.phone && 
    (deliveryMethod === "pickup" || (billingData.areaId && billingData.address)) && 
    (deliveryMethod === "pickup" || shippingRate) && 
    paymentMethod;

  const handlePlaceOrder = async () => {
    if (!isFormValid) return;
    
    // If QR method, show confirmation modal first
    if (paymentMethod === "qris") {
      setIsModalOpen(true);
    } else {
      await processOrder();
    }
  };

  const processOrder = async () => {
    setIsSubmitting(true);
    setIsModalOpen(false);
    
    try {
      if (paymentMethod === "qris") {
        // Generate QRIS using Raja Ongkir Komerce
        const res = await fetch("/api/rajaongkir", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "qris",
            amount: totalAmount,
            external_id: `ORDER-${Date.now()}`,
          }),
        });
        const data = await res.json();
        
        // Simulating redirect to QR page or success page with QR
        // In a real app, you'd handle the QR data here
        console.log("QRIS Generated:", data);
      } else {
        // Normal mock process
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold uppercase tracking-widest">Your cart is empty</h2>
        <Link href="/products" className="bg-black text-white px-8 py-3 uppercase text-sm font-bold hover:bg-gray-800 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="mb-8">
        <Link href="/products" className="text-xs font-bold uppercase flex items-center gap-2 hover:opacity-70 transition-opacity">
          <ArrowLeft className="h-3 w-3" /> Back to Products
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tighter mt-4">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-12">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setDeliveryMethod("shipping");
                setShippingRate(null);
              }}
              className={`flex-1 py-4 border-2 font-bold uppercase transition-all ${
                deliveryMethod === "shipping" ? "border-black bg-black text-white" : "border-gray-200 text-muted-foreground"
              }`}
            >
              Delivery Shipping
            </button>
            <button
              onClick={() => {
                setDeliveryMethod("pickup");
                setShippingRate({
                   courier_name: "Store Pickup",
                   courier_code: "PICKUP",
                   courier_service_name: "Self Pickup",
                   courier_service_code: "PICKUP",
                   price: 0,
                   duration: "Same Day"
                });
              }}
              className={`flex-1 py-4 border-2 font-bold uppercase transition-all ${
                deliveryMethod === "pickup" ? "border-black bg-black text-white" : "border-gray-200 text-muted-foreground"
              }`}
            >
              Ambil di Store
            </button>
          </div>

          <CheckoutForm 
            deliveryMethod={deliveryMethod}
            onChange={(data) => setBillingData(prev => ({ ...prev, ...data }))} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t" style={{ borderColor: "var(--surface-border)" }}>
            {deliveryMethod === "shipping" ? (
              <ShippingSelector 
                billingData={billingData} 
                items={cart} 
                onSelect={(rate) => setShippingRate(rate)} 
              />
            ) : (
              <div className="p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center space-y-2" style={{ borderColor: "var(--surface-border)" }}>
                <p className="text-sm font-bold uppercase">Store Location</p>
                <p className="text-xs text-muted-foreground">Wellborn Flagship Store<br/>Jl. Sultan Agung No. 24, Bandung</p>
              </div>
            )}
            <PaymentSelector 
              onSelect={(methodId) => setPaymentMethod(methodId)} 
            />
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-4 sticky top-24 self-start">
          <OrderSummary 
            items={cart} 
            subtotal={cartTotal} 
            shippingRate={shippingRate} 
          />
          
          <button
            onClick={handlePlaceOrder}
            disabled={!isFormValid || isSubmitting}
            className={`w-full mt-6 py-4 uppercase font-bold tracking-widest transition-all shadow-md flex items-center justify-center gap-2 ${
              isFormValid && !isSubmitting
                ? "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 scale-[1.02]"
                : "bg-surface text-muted-foreground opacity-50 cursor-not-allowed border border-dashed"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Processing...
              </>
            ) : (
              "Place Order"
            )}
          </button>
          
          {!isFormValid && (
            <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-tighter">
              Please complete all required fields, select shipping & payment method
            </p>
          )}
        </div>
      </div>

      <PaymentConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={processOrder}
        items={cart}
        total={totalAmount}
      />
    </div>
  );
}
