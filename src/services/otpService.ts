import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { otpEmailTemplate } from "@/templates/otpEmail";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* SEND OTP */
export const sendOtpService = async (email: string) => {
  const cleanEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (!user) throw new Error("User not found");

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { email: cleanEmail },
    data: { otp, otpExpiry },
  });

  await sendEmail({
    to: cleanEmail,
    subject: "Your OTP Verification Code",
    html: otpEmailTemplate(otp, user.name),
  });

  return { message: "OTP sent successfully" };
};

/* VERIFY OTP */
export const verifyOtpService = async (email: string, otp: string) => {
  const cleanEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (!user) throw new Error("User not found");

  if (!user.otp || user.otp !== otp)
    throw new Error("Invalid OTP");

  if (!user.otpExpiry || user.otpExpiry < new Date())
    throw new Error("OTP expired");

  const updatedUser = await prisma.user.update({
    where: { email: cleanEmail },
    data: {
      isVerified: true,
      otp: null,
      otpExpiry: null,
    },
  });

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    isVerified: updatedUser.isVerified,
  };
};
