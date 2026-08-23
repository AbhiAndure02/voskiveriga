import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/v1/coupons/available
 * List active, non-expired coupons available for customer application
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.trim().toLowerCase() || '';

    const now = new Date();

    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    const availableCoupons = coupons.filter((coupon) => {
      if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
        return false;
      }
      if (coupon.targetedUsers && coupon.targetedUsers.length > 0) {
        if (!email) return false;
        return coupon.targetedUsers.some((e: string) => e.toLowerCase() === email);
      }
      return true;
    });

    return NextResponse.json({
      success: true,
      data: availableCoupons.map((c) => ({
        id: c.id,
        _id: c.id,
        code: c.code,
        description: c.description,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxDiscount: c.maxDiscount,
        validUntil: c.validUntil,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching available coupons:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch available coupons' },
      { status: 500 }
    );
  }
}
