import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { verifyOtpService } from "@/services/otpService";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const user = await verifyOtpService(email, otp);

    return NextResponse.json(
      {
        message: "OTP verified successfully",
        user: {
          id: user.id,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "OTP verification failed" },
      { status: 400 }
    );
  }
}
