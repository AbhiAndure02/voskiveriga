import prisma from '@/lib/prisma';

export type ICouponUsage = {
  id: string;
  _id?: string;
  couponId: string;
  userId?: string | null;
  userEmail: string;
  orderId: string;
  discountAmount: number;
  createdAt: Date;
};

export const CouponUsageModel = prisma.couponUsage;

export default CouponUsageModel;
