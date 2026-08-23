import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const error = searchParams.get("error");

  let message = "Authentication failed";

  switch (error) {
    case "CredentialsSignin":
      message = "Invalid email or password";
      break;
    case "AccessDenied":
      message = "Access denied";
      break;
    case "Configuration":
      message = "Server authentication configuration error";
      break;
    default:
      message = "Authentication error";
  }

  return NextResponse.json(
    {
      success: false,
      error,
      message,
    },
    { status: 401 }
  );
}
