import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { ShiprocketService } from '@/services/ShiprocketService';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { orderStatus, createShipment } = body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return errorResponse('Order not found', 'ORDER_NOT_FOUND', 404);
    }

    if (createShipment && !order.shiprocketOrderId) {
      const shipResult = await ShiprocketService.createOrderShipment({ orderId: id });
      return successResponse(shipResult, 'Order updated & Shiprocket shipment created successfully');
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: orderStatus ? (orderStatus as OrderStatus) : undefined,
      },
    });

    return successResponse({ ...updatedOrder, _id: updatedOrder.id }, 'Order updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update order', 'ORDER_UPDATE_ERROR', 500);
  }
}
