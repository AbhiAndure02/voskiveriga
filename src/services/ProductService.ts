import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export interface ProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'bestselling';
  page?: number;
  limit?: number;
}

export class ProductService {
  /**
   * Search and filter products with pagination
   */
  static async getProducts(params: ProductQueryParams) {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStockOnly,
      featuredOnly,
      sortBy = 'newest',
      page = 1,
      limit = 12,
    } = params;

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { sku: { contains: term, mode: 'insensitive' } },
        { brand: { contains: term, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (brand) {
      where.brand = { equals: brand, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = Number(minPrice);
      if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
    }

    if (inStockOnly) {
      where.stock = { gt: 0 };
    }

    if (featuredOnly) {
      where.isFeatured = true;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    else if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    else if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          specifications: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Fetch single product by slug
   */
  static async getProductBySlug(slug: string) {
    const product = await prisma.product.findFirst({
      where: { slug: slug.toLowerCase(), isActive: true },
      include: {
        specifications: true,
      },
    });
    return product;
  }

  /**
   * Fetch distinct categories and brands for filter options
   */
  static async getFilterOptions() {
    const [categories, activeProducts] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, image: true },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        select: { brand: true },
        distinct: ['brand'],
      }),
    ]);

    const brands = activeProducts.map((p: { brand: string; }) => p.brand).filter(Boolean);

    return { categories, brands };
  }
}
