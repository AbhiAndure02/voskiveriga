import { NextResponse } from "next/server";
import { getShiprocketTracking } from "@/lib/shiprocket";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID or AWB number is required." },
        { status: 400 }
      );
    }

    const trackingData = await getShiprocketTracking(orderId);
    return NextResponse.json(trackingData);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to retrieve shipment tracking details." },
      { status: 500 }
    );
  }
}
