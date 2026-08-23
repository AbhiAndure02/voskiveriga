import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { PaymentStatus, UserRole } from '@prisma/client';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET(req: NextRequest) {
  try {
    const [
      totalOrders,
      paidOrders,
      totalCustomers,
      totalProducts,
      allProductsForLowStock,
      totalCoupons,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({ where: { paymentStatus: PaymentStatus.PAID } }),
      prisma.user.count({ where: { role: UserRole.USER } }),
      prisma.product.count(),
      prisma.product.findMany({ select: { stock: true, lowStockThreshold: true } }),
      prisma.coupon.count(),
    ]);

    const lowStockProducts = allProductsForLowStock.filter(
      (p) => p.stock <= p.lowStockThreshold
    ).length;

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayOrders = await prisma.order.findMany({
      where: { createdAt: { gte: todayStart } },
    });
    const todayRevenue = todayOrders
      .filter((o) => o.paymentStatus === PaymentStatus.PAID)
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const pendingShipments = await prisma.order.count({
      where: {
        paymentStatus: PaymentStatus.PAID,
        orderStatus: { in: ['CONFIRMED', 'PROCESSING'] },
      },
    });

    return successResponse({
      metrics: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        todayRevenue,
        todayOrdersCount: todayOrders.length,
        pendingShipments,
        lowStockProducts,
        totalCoupons,
      },
    }, 'Admin dashboard metrics fetched successfully');
  } catch (error: any) {
    console.error('Error fetching admin dashboard metrics:', error);
    return errorResponse(error.message || 'Failed to fetch dashboard metrics', 'DASHBOARD_METRICS_ERROR', 500);
  }
}
