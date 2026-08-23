import { NextRequest } from 'next/server';
import { ProductService } from '@/services/ProductService';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

/**
 * GET /api/products/[slug]
 * Public product details fetch
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await ProductService.getProductBySlug(slug);

    if (!product) {
      return errorResponse('Product not found', 'PRODUCT_NOT_FOUND', 404);
    }

    return successResponse(product, 'Product fetched successfully');
  } catch (error: any) {
    console.error('Error fetching product details:', error);
    return errorResponse(error.message || 'Failed to fetch product', 'PRODUCT_FETCH_ERROR', 500);
  }
}
