import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { registerService } from "@/services/auth.service";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, email, password, number, address } = await req.json();

    if (!name || !email || !password || !number ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const result = await registerService(
      name,
      email,
      password,
      number,
      address
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}
