import { NextRequest } from 'next/server';
import { OrderService } from '@/services/OrderService';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const order = await OrderService.createOrder(body);

    return successResponse({ ...order, _id: order.id }, 'Order created successfully. Proceed to payment.', 201);
  } catch (error: any) {
    console.error('Order creation error:', error);
    return errorResponse(
      error.message || 'Failed to create order',
      error.errorCode || 'ORDER_CREATE_ERROR',
      error.statusCode || 400
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.trim().toLowerCase();
    const userId = searchParams.get('userId');

    if (!email && !userId) {
      return errorResponse('User email or ID is required', 'PARAM_REQUIRED', 400);
    }

    const where: any = {};
    if (email) where.customerEmail = email;
    if (userId) where.userId = userId;

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return successResponse(orders.map((o) => ({ ...o, _id: o.id })), 'Customer orders fetched successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch orders', 'ORDERS_FETCH_ERROR', 500);
  }
}
