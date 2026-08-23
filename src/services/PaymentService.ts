import crypto from 'crypto';
import Razorpay from 'razorpay';
import prisma from '@/lib/prisma';
import { PaymentError } from '@/lib/errors/customErrors';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

export class PaymentService {
  private static getRazorpayInstance() {
    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials are not configured in environment variables');
    }
    return new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });
  }

  /**
   * Create Razorpay payment order
   */
  static async createRazorpayOrder(orderId: string, amountInRupees: number) {
    const razorpay = this.getRazorpayInstance();
    const amountInPaise = Math.round(amountInRupees * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${orderId.slice(-8)}`,
      payment_capture: 1,
    };

    try {
      const rzpOrder = await razorpay.orders.create(options);

      // Create Payment log entry in PostgreSQL
      await prisma.payment.create({
        data: {
          orderId,
          razorpayOrderId: rzpOrder.id,
          amount: amountInRupees,
          currency: 'INR',
          status: 'created',
        },
      });

      return {
        razorpayOrderId: rzpOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        keyId: razorpayKeyId,
      };
    } catch (error: any) {
      console.error('Razorpay order creation failed:', error);
      throw new PaymentError(error.message || 'Razorpay order creation failed');
    }
  }

  /**
   * Verify Razorpay Payment Signature
   */
  static verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    if (!razorpayKeySecret) {
      throw new Error('RAZORPAY_KEY_SECRET is not configured');
    }

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpaySignature;
  }

  /**
   * Verify Razorpay Webhook Signature
   */
  static verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return expectedSignature === signature;
  }
}
