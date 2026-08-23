import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { userId, profileId } = await req.json();

    if (!userId || !profileId) {
      return NextResponse.json(
        { message: "User ID and Profile ID required" },
        { status: 400 }
      );
    }

    // Set all user's profiles to isActive: false
    await prisma.profile.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    // Set target profile to isActive: true
    await prisma.profile.update({
      where: { id: profileId },
      data: { isActive: true },
    });

    return NextResponse.json({ message: "Profile switched successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
