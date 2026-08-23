import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, profile } = await req.json();

    if (!userId || !profile) {
      return NextResponse.json(
        { message: "User ID and profile are required" },
        { status: 400 }
      );
    }

    await prisma.profile.create({
      data: {
        userId,
        type: profile.type || "personal",
        name: profile.name,
        address: profile.address,
        businessName: profile.businessName,
        gstNumber: profile.gstNumber,
        isActive: false,
      },
    });

    return NextResponse.json({ message: "Profile added successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
