import prisma from '@/lib/prisma';

export type IPayment = {
  id: string;
  _id?: string;
  orderId: string;
  userId?: string | null;
  razorpayOrderId: string;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  amount: number;
  currency: string;
  status: string;
  method?: string | null;
  errorDescription?: string | null;
  rawPayload?: any;
  createdAt: Date;
  updatedAt: Date;
};

export const PaymentModel = prisma.payment;

export default PaymentModel;
