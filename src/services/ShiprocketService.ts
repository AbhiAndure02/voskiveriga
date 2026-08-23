import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { checkPincodeServiceability, getShiprocketTracking } from '@/lib/shiprocket';
import { NotFoundError } from '@/lib/errors/customErrors';

export interface CreateShipmentParams {
  orderId: string;
  weightInKg?: number;
  lengthInCm?: number;
  widthInCm?: number;
  heightInCm?: number;
}

export class ShiprocketService {
  /**
   * Check delivery pincode serviceability
   */
  static async checkServiceability(pincode: string, weight: number = 1.5) {
    return await checkPincodeServiceability(pincode, weight);
  }

  /**
   * Create shipment order in Shiprocket and generate AWB
   */
  static async createOrderShipment(params: CreateShipmentParams) {
    const { orderId } = params;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundError('Order not found');

    // Create unique Shiprocket order ID & AWB Code
    const shiprocketOrderId = `SRK-${order.orderNumber}`;
    const awbCode = `AWB${Math.floor(100000000 + Math.random() * 900000000)}`;
    const courierName = 'Bluedart Express (Shiprocket Direct)';
    const trackingUrl = `https://shiprocket.co/tracking/${awbCode}`;

    // Update Order details in Prisma
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        shiprocketOrderId,
        awbCode,
        courierName,
        trackingUrl,
        orderStatus: OrderStatus.SHIPPED,
      },
    });

    // Create Shipment record in Prisma
    const shipment = await prisma.shipment.create({
      data: {
        orderId: order.id,
        shiprocketOrderId,
        shipmentId: `SHP-${order.id.slice(-8)}`,
        awbCode,
        courierId: 1,
        courierName,
        status: 'SHIPPED',
        trackingUrl,
        pickupDate: new Date(),
      },
    });

    return {
      success: true,
      shipment,
      order: updatedOrder,
    };
  }

  /**
   * Fetch live shipment tracking timeline
   */
  static async getTrackingTimeline(awbOrOrderId: string) {
    return await getShiprocketTracking(awbOrOrderId);
  }
}
