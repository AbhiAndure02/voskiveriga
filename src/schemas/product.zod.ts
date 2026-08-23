import { z } from "zod";

/* =========================
   REUSABLE HELPERS
========================= */

const nonEmptyString = (field: string) =>
  z.string().trim().min(1, `${field} is required`);

export const specificationZodSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

/* =========================
   PRODUCT ZOD SCHEMA
========================= */

export const ProductZodSchema = z.object({
  /* ---------- Core ---------- */
  name: nonEmptyString("Product name"),

  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .optional(), // optional if auto-generated

  sku: z.string().trim().min(1, "SKU is required").optional(),

  description: nonEmptyString("Product description"),

  shortDescription: z.string().trim().optional(),

  brand: z.string().trim().optional().default("Voskiveriga"),

  price: z
    .number()
    .min(0, "Price cannot be negative"),

  mrp: z.number().min(0).optional().default(0),

  tax: z.number().min(0).optional().default(18),

  category: nonEmptyString("Product category"),

  stock: z
    .number()
    .min(0, "Stock cannot be negative")
    .default(0),

  lowStockThreshold: z.number().min(0).optional().default(5),

  unit: z.string().optional().default("Piece"),

  minimumOrderQuantity: z.number().min(1).optional().default(1),

  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one product image is required"),

  specifications: z.array(specificationZodSchema).optional().default([]),

  tags: z.array(z.string()).optional().default([]),

  isFeatured: z.boolean().optional().default(false),

  isActive: z.boolean().optional().default(true),

  /* ---------- SEO ---------- */
  metaTitle: z.string().trim().max(60, "Meta title should be under 60 chars").optional(),

  metaDescription: z
    .string()
    .trim()
    .max(160, "Meta description should be under 160 chars")
    .optional(),

  metaKeywords: z.array(z.string()).optional(),

  canonicalUrl: z.string().url("Invalid canonical URL").optional(),

  indexable: z.boolean().optional().default(true),
});

/* =========================
   TYPES
========================= */

export type ProductInput = z.infer<typeof ProductZodSchema>;
export type ProductUpdateInput = Partial<ProductInput>;
export type ProductQueryParams = {
  category?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
};
export type ProductZodType = typeof ProductZodSchema;
