import { registerService } from "@/services/auth.service";
import { NextResponse } from "next/server";

export const registerController = async (body: any) => {
  try {
    const result = await registerService(
      body.name,
      body.email,
      body.password,
      body.number,
      body.address
    );

    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
};
