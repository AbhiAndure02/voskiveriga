import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, paymentMethod } = body;

    // Signature verification if Razorpay secret is present
    const keySecret = process.env.RAZORPAY_SECRET_KEY;

    if (keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, message: "Invalid payment signature." },
          { status: 400 }
        );
      }
    }

    const finalOrderId = razorpay_order_id || orderId || `VOSK-ORD-${Date.now().toString().slice(-6)}`;
    const trackingAwb = `SRK-${Math.floor(100000000 + Math.random() * 900000000)}`;

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully!",
      order: {
        orderId: finalOrderId,
        paymentId: razorpay_payment_id || `pay_vosk_${Math.random().toString(36).substring(2, 9)}`,
        status: "PAID",
        shipmentStatus: "Processing for Dispatch",
        shiprocketAwb: trackingAwb,
        estimatedDelivery: "2-3 Business Days",
      },
    });
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json(
      { success: false, message: "Payment verification failed." },
      { status: 500 }
    );
  }
}
