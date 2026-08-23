import { NextRequest } from 'next/server';
import { ProductService } from '@/services/ProductService';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

/**
 * GET /api/products
 * Public catalog search, filtering, and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const inStockOnly = searchParams.get('inStock') === 'true';
    const featuredOnly = searchParams.get('featured') === 'true';
    const sortBy = (searchParams.get('sortBy') as any) || 'newest';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;

    const result = await ProductService.getProducts({
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStockOnly,
      featuredOnly,
      sortBy,
      page,
      limit,
    });

    return successResponse(result, 'Products fetched successfully');
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return errorResponse(error.message || 'Failed to fetch products', 'PRODUCT_FETCH_ERROR', 500);
  }
}
