import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';
import { couponEmailTemplate } from '@/templates/couponEmail';

/**
 * POST /api/v1/coupons/send
 * Dispatch coupon promo emails to users via Nodemailer
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { couponId, recipientEmails, sendToAllUsers, customMessage } = body;

    if (!couponId) {
      return NextResponse.json(
        { success: false, message: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Coupon not found' },
        { status: 404 }
      );
    }

    let targets: { email: string; name?: string }[] = [];

    if (sendToAllUsers) {
      const users = await prisma.user.findMany({ select: { email: true, name: true } });
      targets = users.map((u) => ({ email: u.email, name: u.name }));
    } else if (Array.isArray(recipientEmails) && recipientEmails.length > 0) {
      const emails = recipientEmails
        .map((e: string) => e.trim().toLowerCase())
        .filter(Boolean);

      const matchedUsers = await prisma.user.findMany({
        where: { email: { in: emails } },
        select: { email: true, name: true },
      });
      const userMap = new Map<string, string>();
      matchedUsers.forEach((u) => userMap.set(u.email.toLowerCase(), u.name));

      targets = emails.map((email: string) => ({
        email,
        name: userMap.get(email),
      }));
    } else {
      return NextResponse.json(
        { success: false, message: 'Please select recipients or send to all users.' },
        { status: 400 }
      );
    }

    if (targets.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid recipient email addresses found.' },
        { status: 400 }
      );
    }

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (const target of targets) {
      try {
        const html = couponEmailTemplate({
          userName: target.name,
          userEmail: target.email,
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType as any,
          discountValue: coupon.discountValue,
          minOrderAmount: coupon.minOrderAmount,
          maxDiscount: coupon.maxDiscount || undefined,
          validUntil: coupon.validUntil,
          customMessage,
        });

        await sendEmail({
          to: target.email,
          subject: `🎁 Exclusive Discount Voucher: ${coupon.code} inside!`,
          html,
        });

        successCount++;
      } catch (err: any) {
        console.error(`Failed to send coupon email to ${target.email}:`, err);
        failCount++;
        errors.push(`${target.email}: ${err.message || 'Send error'}`);
      }
    }

    if (!sendToAllUsers && recipientEmails) {
      const newTargets = Array.from(
        new Set([...(coupon.targetedUsers || []), ...targets.map((t) => t.email)])
      );
      await prisma.coupon.update({
        where: { id: couponId },
        data: { targetedUsers: newTargets },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Coupon emails dispatched successfully! Sent: ${successCount}, Failed: ${failCount}`,
      summary: {
        totalTargeted: targets.length,
        successCount,
        failCount,
        errors,
      },
    });
  } catch (error: any) {
    console.error('Error sending coupon emails:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to dispatch coupon emails' },
      { status: 500 }
    );
  }
}
