import prisma from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { InventoryError, CouponError, NotFoundError } from '@/lib/errors/customErrors';

export interface IOrderItemSnapshotInput {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  tax: number;
  subtotal: number;
  image?: string;
}

export interface CreateOrderParams {
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { productId: string; quantity: number }[];
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  couponCode?: string;
  paymentMethod?: string;
  notes?: string;
}

export class OrderService {
  /**
   * Create an order with server-side price verification and coupon application
   */
  static async createOrder(params: CreateOrderParams) {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      couponCode,
      paymentMethod = 'razorpay',
      notes,
    } = params;

    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // 1. Fetch products from database & verify prices and stock
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const dbProductMap = new Map();
    dbProducts.forEach((p: { id: string; }) => dbProductMap.set(p.id, p));

    const itemSnapshots: IOrderItemSnapshotInput[] = [];
    let subtotal = 0;
    let totalTax = 0;

    for (const item of items) {
      const product = dbProductMap.get(item.productId);
      if (!product) {
        throw new NotFoundError(`Product with ID ${item.productId} not found or inactive`);
      }

      if (product.stock < item.quantity) {
        throw new InventoryError(
          `Insufficient stock for '${product.name}'. Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }

      if (product.minimumOrderQuantity && item.quantity < product.minimumOrderQuantity) {
        throw new Error(
          `Minimum order quantity for '${product.name}' is ${product.minimumOrderQuantity}`
        );
      }

      const itemSubtotal = product.price * item.quantity;
      const itemTax = Math.round((itemSubtotal * (product.tax || 18)) / 100);

      subtotal += itemSubtotal;
      totalTax += itemTax;

      itemSnapshots.push({
        productId: product.id,
        name: product.name,
        sku: product.sku || 'SKU-GEN',
        price: product.price,
        quantity: item.quantity,
        tax: product.tax || 18,
        subtotal: itemSubtotal,
        image: product.images[0] || '',
      });
    }

    // 2. Validate Coupon if provided
    let discountAmount = 0;
    let couponInfo: any = undefined;

    if (couponCode && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });

      if (!coupon || !coupon.isActive) {
        throw new CouponError(`Coupon '${cleanCode}' is invalid or inactive`);
      }

      const now = new Date();
      if (new Date(coupon.validUntil) < now) {
        throw new CouponError(`Coupon '${cleanCode}' has expired`);
      }

      if (subtotal < coupon.minOrderAmount) {
        throw new CouponError(
          `Coupon '${cleanCode}' requires a minimum subtotal of ₹${coupon.minOrderAmount}`
        );
      }

      if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
        throw new CouponError(`Coupon '${cleanCode}' has reached its global limit`);
      }

      if (coupon.discountType === 'percentage') {
        discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = Math.min(subtotal, coupon.discountValue);
      }

      couponInfo = {
        couponId: coupon.id,
        code: coupon.code,
        discountAmount,
      };
    }

    // 3. Shipping Fee (Flat ₹100 or Free if subtotal >= ₹5000)
    const shippingFee = subtotal >= 5000 ? 0 : 100;
    const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

    // 4. Generate unique Order Number (e.g. ORD-2026-84920)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ORD-${new Date().getFullYear()}-${randomSuffix}`;

    // 5. Save Order record in Prisma
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        subtotal,
        discount: discountAmount,
        tax: totalTax,
        shippingFee,
        total: grandTotal,
        coupon: couponInfo || undefined,
        paymentStatus: PaymentStatus.PENDING,
        orderStatus: OrderStatus.PENDING,
        paymentMethod,
        notes,
        items: {
          create: itemSnapshots.map((item) => ({
            productId: item.productId,
            name: item.name,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
            tax: item.tax,
            subtotal: item.subtotal,
            image: item.image,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }

  /**
   * Finalize order after successful payment: reduce stock & record coupon usage
   */
  static async confirmOrderPayment(
    orderId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new NotFoundError('Order not found');

    if (order.paymentStatus === PaymentStatus.PAID) {
      return order; // Idempotent check
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.CONFIRMED,
        razorpayPaymentId,
        razorpayOrderId,
      },
      include: { items: true },
    });

    // 1. Deduct stock atomically
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // 2. Record coupon usage idempotently if applied
    if (order.coupon) {
      const couponData = order.coupon as any;
      if (couponData?.couponId) {
        const existingUsage = await prisma.couponUsage.findUnique({
          where: { orderId: order.id },
        });

        if (!existingUsage) {
          await prisma.couponUsage.create({
            data: {
              couponId: couponData.couponId,
              userId: order.userId,
              userEmail: order.customerEmail,
              orderId: order.id,
              discountAmount: couponData.discountAmount || 0,
            },
          });

          await prisma.coupon.update({
            where: { id: couponData.couponId },
            data: { timesUsed: { increment: 1 } },
          });
        }
      }
    }

    return updatedOrder;
  }
}
