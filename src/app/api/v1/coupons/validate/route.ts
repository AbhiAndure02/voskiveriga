import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal, userEmail } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, valid: false, message: 'Please enter a coupon code.' },
        { status: 400 }
      );
    }

    if (subtotal === undefined || subtotal === null || isNaN(subtotal)) {
      return NextResponse.json(
        { success: false, valid: false, message: 'Invalid subtotal provided.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({ where: { code: cleanCode } });

    if (!coupon) {
      return NextResponse.json(
        { success: false, valid: false, message: `Coupon code '${cleanCode}' does not exist.` },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, valid: false, message: `Coupon code '${cleanCode}' is currently inactive.` },
        { status: 400 }
      );
    }

    const now = new Date();
    if (new Date(coupon.validUntil) < now) {
      return NextResponse.json(
        { success: false, valid: false, message: `Coupon '${cleanCode}' expired on ${new Date(coupon.validUntil).toLocaleDateString()}.` },
        { status: 400 }
      );
    }

    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return NextResponse.json(
        { success: false, valid: false, message: `Coupon '${cleanCode}' is not active yet.` },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, valid: false, message: `Coupon '${cleanCode}' has reached its maximum global usage limit.` },
        { status: 400 }
      );
    }

    if (subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          message: `Coupon '${cleanCode}' requires a minimum order amount of ₹${coupon.minOrderAmount.toLocaleString('en-IN')}. Add ₹${(coupon.minOrderAmount - subtotal).toLocaleString('en-IN')} more to unlock this discount!`,
        },
        { status: 400 }
      );
    }

    const cleanEmail = userEmail ? userEmail.trim().toLowerCase() : '';
    if (coupon.targetedUsers && coupon.targetedUsers.length > 0) {
      if (!cleanEmail) {
        return NextResponse.json(
          { success: false, valid: false, message: `Coupon '${cleanCode}' is reserved for specific email addresses. Please sign in or provide your email.` },
          { status: 400 }
        );
      }
      const isTargeted = coupon.targetedUsers.some((e: string) => e.toLowerCase() === cleanEmail);
      if (!isTargeted) {
        return NextResponse.json(
          { success: false, valid: false, message: `Coupon '${cleanCode}' is exclusive to selected accounts and cannot be applied to ${cleanEmail}.` },
          { status: 400 }
        );
      }
    }

    if (cleanEmail && coupon.perUserLimit) {
      const userUsagesCount = await prisma.couponUsage.count({
        where: { couponId: coupon.id, userEmail: cleanEmail },
      });
      if (userUsagesCount >= coupon.perUserLimit) {
        return NextResponse.json(
          { success: false, valid: false, message: `You have already used coupon '${cleanCode}' the maximum allowed ${coupon.perUserLimit} time(s).` },
          { status: 400 }
        );
      }
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = Math.min(subtotal, coupon.discountValue);
    }

    return NextResponse.json({
      success: true,
      valid: true,
      discountAmount,
      coupon: {
        id: coupon.id,
        _id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount,
      },
      message: `Coupon '${coupon.code}' applied! You save ₹${discountAmount.toLocaleString('en-IN')}`,
    });
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { success: false, valid: false, message: error.message || 'Validation error' },
      { status: 500 }
    );
  }
}
