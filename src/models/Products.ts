import prisma from '@/lib/prisma';

export interface ISpecification {
  key: string;
  value: string;
}

export type Product = {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string | null;
  category: string;
  categoryId?: string | null;
  brand: string;
  images: string[];
  price: number;
  mrp: number;
  tax: number;
  gst: number;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  minimumOrderQuantity: number;
  specifications?: ISpecification[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string[];
  canonicalUrl?: string | null;
  indexable: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const ProductModel = prisma.product;

export default ProductModel;
