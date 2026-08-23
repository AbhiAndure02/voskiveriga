import { OrderStatus, PaymentStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

export { OrderStatus, PaymentStatus };

export interface IOrderItemSnapshot {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  tax: number;
  subtotal: number;
  image?: string;
}

export type IOrder = {
  id: string;
  _id?: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItemSnapshot[];
  shippingAddress: any;
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  coupon?: any;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  shiprocketOrderId?: string | null;
  shipmentId?: string | null;
  awbCode?: string | null;
  courierName?: string | null;
  trackingUrl?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default prisma.order;
