import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { PaymentService } from '@/services/PaymentService';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

/**
 * POST /api/payments/create-order
 * Initiate Razorpay Order ID for checkout
 */
export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return errorResponse('Order ID is required', 'ORDER_ID_REQUIRED', 400);
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return errorResponse('Order not found', 'ORDER_NOT_FOUND', 404);
    }

    const rzpData = await PaymentService.createRazorpayOrder(order.id, order.total);

    // Save Razorpay order ID to order document
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rzpData.razorpayOrderId },
    });

    return successResponse(
      {
        orderId: updatedOrder.id,
        _id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        razorpayOrderId: rzpData.razorpayOrderId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        keyId: rzpData.keyId,
        customer: {
          name: updatedOrder.customerName,
          email: updatedOrder.customerEmail,
          phone: updatedOrder.customerPhone,
        },
      },
      'Razorpay order created successfully'
    );
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return errorResponse(error.message || 'Payment initiation failed', 'PAYMENT_INIT_ERROR', 500);
  }
}
