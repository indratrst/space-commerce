import { NextResponse } from "next/server";

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
// const RAJAONGKIR_QRIS_KEY = process.env.RAJAONGKIR_QRIS_KEY;
const RAJAONGKIR_BASE_URL = "https://rajaongkir.komerce.id/api/v1";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // destination/province, destination/city/{id}, etc.

  if (!type)
    return NextResponse.json({ error: "Type required" }, { status: 400 });

  const response = await fetch(`${RAJAONGKIR_BASE_URL}/${type}`, {
    headers: {
      key: RAJAONGKIR_API_KEY!,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...payload } = body;

    // if (type === "qris") {
    //   console.log("Generating QRIS with payload:", payload);

    //   const response = await fetch(`${RAJAONGKIR_BASE_URL}/payment/qris/generate`, {
    //     method: "POST",
    //     headers: {
    //       key: RAJAONGKIR_QRIS_KEY!,
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: new URLSearchParams(payload).toString(),
    //   });

    //   const text = await response.text();
    //   console.log("Raja Ongkir QRIS Response Raw:", text);

    //   try {
    //     const data = JSON.parse(text);
    //     return NextResponse.json(data);
    //   } catch (e) {
    //     return NextResponse.json({
    //       error: "Invalid JSON response from Raja Ongkir",
    //       raw: text.substring(0, 500)
    //     }, { status: 500 });
    //   }
    // }

    const endpoint =
      type === "district"
        ? "calculate/district/domestic-cost"
        : "calculate/domestic-cost";

    const response = await fetch(`${RAJAONGKIR_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        key: RAJAONGKIR_API_KEY!,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(payload).toString(),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
