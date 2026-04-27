import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const MIDTRANS_BASE_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      billingData,
      shippingRate,
      subtotal,
      shippingCost,
      total,
    } = body;

    const orderId = `ORDER-${uuidv4().split("-")[0].toUpperCase()}-${Date.now()}`;

    const transactionPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
      },
      customer_details: {
        first_name: billingData.firstName,
        last_name: billingData.lastName,
        email: billingData.email,
        phone: billingData.phone,
        shipping_address: billingData.address
          ? {
              first_name: billingData.firstName,
              last_name: billingData.lastName,
              email: billingData.email,
              phone: billingData.phone,
              address: billingData.address,
              city: billingData.city_name || "",
              postal_code: billingData.postcode || "",
              country_code: "IDN",
            }
          : undefined,
      },
      item_details: [
        ...items.map((item: any) => ({
          id: String(item.product.id),
          price: item.product.price,
          quantity: item.quantity,
          name: item.product.title.substring(0, 50),
        })),
        ...(shippingCost > 0
          ? [
              {
                id: "SHIPPING",
                price: shippingCost,
                quantity: 1,
                name: shippingRate?.courier_name
                  ? `Ongkir - ${shippingRate.courier_name} ${shippingRate.courier_service_name}`
                  : "Ongkos Kirim",
              },
            ]
          : []),
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/pending`,
      },
    };

    const encodedKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString(
      "base64"
    );

    const response = await fetch(MIDTRANS_BASE_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedKey}`,
      },
      body: JSON.stringify(transactionPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Midtrans Error:", data);
      return NextResponse.json(
        { error: data.error_messages || "Failed to create transaction" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      token: data.token,
      redirect_url: data.redirect_url,
      order_id: orderId,
    });
  } catch (error: any) {
    console.error("Midtrans route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
