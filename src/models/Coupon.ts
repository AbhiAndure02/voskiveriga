import prisma from '@/lib/prisma';

export interface IUserUsage {
  userId?: string;
  email?: string;
  count: number;
}

export type ICoupon = {
  id: string;
  _id?: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number | null;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  timesUsed: number;
  perUserLimit: number;
  targetedUsers: string[];
  userUsage?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const CouponModel = prisma.coupon;

export default CouponModel;
