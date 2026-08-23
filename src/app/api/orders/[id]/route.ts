import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, payments: true, shipments: true },
    });

    if (!order) {
      return errorResponse('Order not found', 'ORDER_NOT_FOUND', 404);
    }

    return successResponse({ ...order, _id: order.id }, 'Order details fetched successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch order', 'ORDER_FETCH_ERROR', 500);
  }
}
