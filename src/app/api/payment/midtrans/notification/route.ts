import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { OrderStatus } from "@prisma/client";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract notification data
    const {
      order_id,
      transaction_status,
      status_code,
      gross_amount,
      signature_key,
    } = body;

    // Verify signature using Midtrans notification formula
    const signatureString = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(signatureString)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.error("Invalid signature for order:", order_id, { body });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Map Midtrans status to our OrderStatus
    let newStatus: OrderStatus;
    switch (transaction_status) {
      case "pending":
        newStatus = OrderStatus.PENDING;
        break;
      case "settlement":
        newStatus = OrderStatus.SETTLEMENT;
        break;
      case "paid":
        newStatus = OrderStatus.PAID;
        break;
      case "expired":
        newStatus = OrderStatus.EXPIRED;
        break;
      case "cancel":
        newStatus = OrderStatus.CANCEL;
        break;
      case "failure":
        newStatus = OrderStatus.FAILED;
        break;
      default:
        console.warn("Unknown transaction status:", transaction_status);
        newStatus = OrderStatus.PENDING;
    }

    // Update order status in database
    const updatedOrder = await prisma.order.update({
      where: { id: order_id },
      data: {
        status: newStatus as OrderStatus,
      },
    });

    console.log(`Order ${order_id} status updated to ${newStatus}`);

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: unknown) {
    console.error("Midtrans notification error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
