import { NextRequest } from 'next/server';
import { ProductService } from '@/services/ProductService';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

type ProductSort = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'bestselling';

const sortOptions = new Set<ProductSort>([
  'relevance',
  'price_asc',
  'price_desc',
  'newest',
  'bestselling',
]);

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isDatabaseConnectionError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("can't reach database server") ||
    message.includes('connect econnrefused') ||
    message.includes('connection refused')
  );
}

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
    const requestedSort = searchParams.get('sortBy') as ProductSort | null;
    const sortBy = requestedSort && sortOptions.has(requestedSort) ? requestedSort : 'newest';
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
  } catch (error: unknown) {
    console.error('Error fetching products:', error);

    if (process.env.NODE_ENV === 'development' && isDatabaseConnectionError(error)) {
      const { searchParams } = new URL(req.url);
      const page = Number(searchParams.get('page')) || 1;
      const limit = Number(searchParams.get('limit')) || 12;

      return successResponse(
        {
          products: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        },
        'Database is not reachable. Start PostgreSQL on localhost:5432 to load products.'
      );
    }

    return errorResponse(getErrorMessage(error) || 'Failed to fetch products', 'PRODUCT_FETCH_ERROR', 500);
  }
}
