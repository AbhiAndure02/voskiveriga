import { NextResponse } from "next/server";
import { checkPincodeServiceability } from "@/lib/shiprocket";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pincode, weight, isCod } = body;

    if (!pincode) {
      return NextResponse.json(
        { success: false, message: "Pincode is required." },
        { status: 400 }
      );
    }

    const result = await checkPincodeServiceability(pincode, weight || 1.5, !!isCod);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error checking shipping serviceability." },
      { status: 500 }
    );
  }
}
