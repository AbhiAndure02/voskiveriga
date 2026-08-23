import { z } from "zod";
import { emailSchema } from "./email";

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: z.string().length(6, "OTP must be 6 digits"),
});
