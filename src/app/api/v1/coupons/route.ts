import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * GET /api/v1/coupons
 * Fetch list of coupons with optional filtering and analytics stats
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';

    const where: Prisma.CouponWhereInput = {};
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const now = new Date();
    if (status === 'active') {
      where.isActive = true;
      where.validUntil = { gte: now };
    } else if (status === 'expired') {
      where.validUntil = { lt: now };
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const allCoupons = await prisma.coupon.findMany();
    const totalCoupons = allCoupons.length;
    const activeCoupons = allCoupons.filter(
      (c) => c.isActive && new Date(c.validUntil) >= now
    ).length;
    const expiredCoupons = allCoupons.filter(
      (c) => new Date(c.validUntil) < now
    ).length;
    const totalRedemptions = allCoupons.reduce(
      (acc, c) => acc + (c.timesUsed || 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: coupons.map((c) => ({ ...c, _id: c.id })),
      stats: {
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        totalRedemptions,
      },
    });
  } catch (error: any) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/coupons
 * Create a new coupon
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      perUserLimit,
      targetedUsers,
      isActive,
    } = body;

    if (!code || !description || !discountType || discountValue === undefined || !validUntil) {
      return NextResponse.json(
        { success: false, message: 'Please provide code, description, discount type, discount value, and valid until date.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Coupon with code '${cleanCode}' already exists.` },
        { status: 400 }
      );
    }

    let processedTargetedUsers: string[] = [];
    if (Array.isArray(targetedUsers)) {
      processedTargetedUsers = targetedUsers.map((e) => e.trim().toLowerCase()).filter(Boolean);
    } else if (typeof targetedUsers === 'string' && targetedUsers.trim()) {
      processedTargetedUsers = targetedUsers
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validUntil: new Date(validUntil),
        usageLimit: usageLimit ? Number(usageLimit) : 1000,
        perUserLimit: perUserLimit ? Number(perUserLimit) : 1,
        targetedUsers: processedTargetedUsers,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Coupon created successfully!',
        data: { ...newCoupon, _id: newCoupon.id },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
