import { NextRequest } from 'next/server';
import { InventoryService } from '@/services/InventoryService';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

/**
 * GET /api/admin/inventory
 * Fetch inventory list with low stock detection
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = (searchParams.get('filter') as any) || 'ALL';

    const result = await InventoryService.getInventory(filter);

    return successResponse(result, 'Inventory fetched successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch inventory', 'INVENTORY_FETCH_ERROR', 500);
  }
}

/**
 * PUT /api/admin/inventory
 * Update product stock quantity
 */
export async function PUT(req: NextRequest) {
  try {
    const { productId, stock } = await req.json();

    if (!productId || stock === undefined) {
      return errorResponse('Product ID and stock are required', 'PARAM_REQUIRED', 400);
    }

    const updated = await InventoryService.updateStock(productId, Number(stock));

    return successResponse(updated, 'Product stock updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update stock', 'STOCK_UPDATE_ERROR', 400);
  }
}
