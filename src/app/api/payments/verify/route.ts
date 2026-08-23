import { NextRequest } from 'next/server';
import { PaymentService } from '@/services/PaymentService';
import { OrderService } from '@/services/OrderService';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

/**
 * POST /api/payments/verify
 * HMAC SHA256 Signature Verification & Order Confirmation
 */
export async function POST(req: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return errorResponse('Missing required payment parameters', 'MISSING_PARAMS', 400);
    }

    // 1. Verify HMAC SHA256 Signature
    const isValid = PaymentService.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return errorResponse('Payment signature verification failed', 'INVALID_SIGNATURE', 400);
    }

    // 2. Confirm order payment, reduce stock, and record coupon usage
    const confirmedOrder = await OrderService.confirmOrderPayment(
      orderId,
      razorpayPaymentId,
      razorpayOrderId
    );

    return successResponse(
      confirmedOrder,
      'Payment verified & order confirmed successfully!'
    );
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return errorResponse(error.message || 'Payment verification failed', 'PAYMENT_VERIFY_ERROR', 500);
  }
}
