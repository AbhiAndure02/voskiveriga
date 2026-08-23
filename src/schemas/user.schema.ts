import { z } from "zod";
import { emailSchema } from "./email";
import { passwordSchema } from "./password";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: emailSchema,
  password: passwordSchema,
});
