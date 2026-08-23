import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PaymentService } from '@/services/PaymentService';
import { OrderService } from '@/services/OrderService';

/**
 * POST /api/webhooks/razorpay
 * Idempotent webhook listener for Razorpay payment events
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSignature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && webhookSignature) {
      const isValid = PaymentService.verifyWebhookSignature(rawBody, webhookSignature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ success: false, message: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      const order = await prisma.order.findFirst({ where: { razorpayOrderId } });
      if (order) {
        await OrderService.confirmOrderPayment(order.id, razorpayPaymentId, razorpayOrderId);

        // Update payment document
        await prisma.payment.updateMany({
          where: { razorpayOrderId },
          data: {
            razorpayPaymentId,
            status: 'captured',
            method: paymentEntity.method,
            rawPayload: payload,
          },
        });
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;

      await prisma.payment.updateMany({
        where: { razorpayOrderId },
        data: {
          status: 'failed',
          errorDescription: paymentEntity.error_description || 'Payment failed',
          rawPayload: payload,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
