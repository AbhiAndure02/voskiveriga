import { z } from "zod";

export const addContactSchema = z.object({
    name: z.string().min(2, "Name too short"),
    email: z.string().email("Invalid email"),
    subject: z.string().min(3),
    message: z.string().min(10),
});

export const deleteContactSchema = z.object({
    id: z.string().min(1, "Invalid contact ID"),
});

export type AddContactInput = z.infer<typeof addContactSchema>;
export type DeleteContactInput = z.infer<typeof deleteContactSchema>;