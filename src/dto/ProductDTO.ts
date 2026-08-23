/**
 * Frontend DTO for Product
 * Mirrors API response, not Mongo schema
 */
export interface ProductDTO {
  _id: string;

  name: string;
  slug: string;

  description: string;
  price: number;
  category: string;

  stock: number;
  images: string[];
  isFeatured: boolean;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  indexable: boolean;

  createdAt: string;
  updatedAt: string;
}
