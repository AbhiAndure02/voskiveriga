import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (body.code && body.code.trim().toUpperCase() !== coupon.code) {
      const cleanCode = body.code.trim().toUpperCase();
      const existing = await prisma.coupon.findFirst({
        where: { code: cleanCode, id: { not: id } },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, message: `Coupon code '${cleanCode}' is already taken.` },
          { status: 400 }
        );
      }
      updateData.code = cleanCode;
    }

    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.discountType !== undefined) updateData.discountType = body.discountType;
    if (body.discountValue !== undefined) updateData.discountValue = Number(body.discountValue);
    if (body.minOrderAmount !== undefined) updateData.minOrderAmount = Number(body.minOrderAmount);
    if (body.maxDiscount !== undefined) updateData.maxDiscount = body.maxDiscount ? Number(body.maxDiscount) : null;
    if (body.validFrom !== undefined) updateData.validFrom = new Date(body.validFrom);
    if (body.validUntil !== undefined) updateData.validUntil = new Date(body.validUntil);
    if (body.usageLimit !== undefined) updateData.usageLimit = Number(body.usageLimit);
    if (body.perUserLimit !== undefined) updateData.perUserLimit = Number(body.perUserLimit);

    if (body.targetedUsers !== undefined) {
      if (Array.isArray(body.targetedUsers)) {
        updateData.targetedUsers = body.targetedUsers.map((e: string) => e.trim().toLowerCase()).filter(Boolean);
      } else if (typeof body.targetedUsers === 'string') {
        updateData.targetedUsers = body.targetedUsers.split(',').map((e: string) => e.trim().toLowerCase()).filter(Boolean);
      }
    }

    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Coupon updated successfully',
      data: { ...updatedCoupon, _id: updatedCoupon.id },
    });
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedCoupon = await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully',
      data: { ...deletedCoupon, _id: deletedCoupon.id },
    });
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
