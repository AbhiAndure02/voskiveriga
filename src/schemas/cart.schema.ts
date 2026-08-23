import { z } from "zod";

/* =========================
   COMMON HELPERS
========================= */

// ID validation (supporting CUID / UUID / strings)
export const objectIdSchema = z
    .string()
    .min(1, "Invalid ID format");

/* =========================
   ADD TO CART
========================= */

export const addToCartSchema = z.object({
    userId: objectIdSchema,
    productId: objectIdSchema,
    quantity: z
        .number()
        .int("Quantity must be an integer")
        .positive("Quantity must be greater than 0")
        .default(1),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;

/* =========================
   UPDATE CART
========================= */

export const updateCartSchema = z.object({
    userId: objectIdSchema,
    productId: objectIdSchema,
    quantity: z
        .number()
        .int("Quantity must be an integer")
        .min(1, "Minimum quantity is 1")
        .max(100, "Maximum quantity exceeded"),
});

export type UpdateCartInput = z.infer<typeof updateCartSchema>;

/* =========================
   REMOVE FROM CART
========================= */

export const removeFromCartSchema = z.object({
    userId: objectIdSchema,
    productId: objectIdSchema,
});

export type RemoveFromCartInput = z.infer<
    typeof removeFromCartSchema
>;

/* =========================
   GET CART
========================= */

export const getCartSchema = z.object({
    userId: objectIdSchema,
});

export type GetCartInput = z.infer<typeof getCartSchema>;
