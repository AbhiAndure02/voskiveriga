import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendOtpService } from "./otpService";

export const registerService = async (
  name: string,
  email: string,
  password: string,
  number: string,
  address?: string
) => {
  const cleanEmail = email.toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });

  // Already verified
  if (existingUser?.isVerified) {
    throw new Error("User already registered. Please login.");
  }

  // Exists but not verified
  if (existingUser && !existingUser.isVerified) {
    const now = new Date();

    if (!existingUser.otpExpiry || existingUser.otpExpiry < now) {
      await sendOtpService(cleanEmail);
    }

    return {
      message: "User already registered but not verified. OTP sent.",
      isVerified: false,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email: cleanEmail,
      password: hashedPassword,
      number,
      isVerified: false,
      profiles: {
        create: [
          {
            type: "personal",
            name,
            address: address || null,
            isActive: true,
          },
        ],
      },
    },
  });

  await sendOtpService(cleanEmail);

  return {
    message: "Registration successful. OTP sent to email.",
    isVerified: false,
  };
};
