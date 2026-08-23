import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderStatus, Prisma } from '@prisma/client';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ALL';

    const where: Prisma.OrderWhereInput = {};
    if (status !== 'ALL') {
      where.orderStatus = status as OrderStatus;
    }

    if (search) {
      const term = search.trim();
      where.OR = [
        { orderNumber: { contains: term, mode: 'insensitive' } },
        { customerName: { contains: term, mode: 'insensitive' } },
        { customerEmail: { contains: term, mode: 'insensitive' } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    return successResponse(orders.map((o) => ({ ...o, _id: o.id })), 'Admin orders fetched successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch orders', 'ADMIN_ORDERS_ERROR', 500);
  }
}
