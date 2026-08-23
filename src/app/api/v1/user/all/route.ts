import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/v1/user/all
 * Fetch list of registered users for admin operations (e.g., sending coupons)
 */
export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        orders: {
          select: {
            total: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            orders: true,
            addresses: true,
            profiles: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        _id: u.id,
        id: u.id,
        name: u.name,
        email: u.email,
        number: u.number,
        role: u.role,
        isActive: u.isActive,
        isVerified: u.isVerified,
        isAdmin: u.isAdmin,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
        orderCount: u._count.orders,
        addressCount: u._count.addresses,
        profileCount: u._count.profiles,
        totalSpent: u.orders
          .filter((order) => order.paymentStatus === 'PAID')
          .reduce((sum, order) => sum + (order.total || 0), 0),
        lastOrderAt: u.orders
          .map((order) => order.createdAt)
          .sort((a, b) => b.getTime() - a.getTime())[0] || null,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
