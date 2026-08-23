import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", items, customer } = body;

    const orderAmount = amount ? Math.round(amount * 100) : 899900; // in paise
    const receipt = `VOSK-${Date.now()}`;

    // Check if Razorpay keys are configured
    const keyId = process.env.RAZORPAY_API_KEY || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET_KEY;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          message: "Razorpay keys are not configured",
        },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const rzpOrder = await razorpay.orders.create({
      amount: orderAmount,
      currency,
      receipt,
      notes: {
        brand: "Voskiveriga",
        customerName: customer?.name || "Customer",
        pincode: customer?.pincode || "",
      },
    });

    return NextResponse.json({
      success: true,
      mode: "razorpay",
      order: rzpOrder,
      keyId,
    });
  } catch (error: any) {
    console.error("Payment Order Creation Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Order creation failed",
      },
      { status: 500 }
    );
  }
}
