import { z } from 'zod';

/* =========================================
   USER AUTHENTICATION SCHEMAS
========================================= */
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  number: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

/* =========================================
   PRODUCT SCHEMAS
========================================= */
export const specificationSchema = z.object({
  key: z.string().min(1, 'Specification key required'),
  value: z.string().min(1, 'Specification value required'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().default('Voskiveriga'),
  images: z.array(z.string().url('Must be a valid image URL')).min(1, 'At least one product image is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  mrp: z.number().min(0, 'MRP cannot be negative').default(0),
  tax: z.number().min(0).default(18),
  stock: z.number().min(0, 'Stock cannot be negative').default(0),
  lowStockThreshold: z.number().min(0).default(5),
  unit: z.string().default('Piece'),
  minimumOrderQuantity: z.number().min(1).default(1),
  specifications: z.array(specificationSchema).default([]),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

/* =========================================
   CATEGORY SCHEMAS
========================================= */
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
});

/* =========================================
   ADDRESS SCHEMAS
========================================= */
export const addressSchema = z.object({
  name: z.string().min(2, 'Contact name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(6, 'Pincode must be 6 digits'),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
});

/* =========================================
   COUPON SCHEMAS
========================================= */
export const couponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters'),
  description: z.string().min(5, 'Description is required'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0, 'Discount value must be non-negative'),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscount: z.number().optional(),
  validFrom: z.string().or(z.date()).optional(),
  validUntil: z.string().or(z.date()),
  usageLimit: z.number().min(1).default(1000),
  perUserLimit: z.number().min(1).default(1),
  targetedUsers: z.array(z.string().email()).optional(),
  isActive: z.boolean().default(true),
});

/* =========================================
   CHECKOUT & PAYMENT SCHEMAS
========================================= */
export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['razorpay', 'cod']).default('razorpay'),
});
