import prisma from '@/lib/prisma';

export type IShipment = {
  id: string;
  _id?: string;
  orderId: string;
  shiprocketOrderId: string;
  shipmentId?: string | null;
  awbCode?: string | null;
  courierId?: number | null;
  courierName?: string | null;
  status: string;
  trackingUrl?: string | null;
  pickupDate?: Date | null;
  deliveryDate?: Date | null;
  rawPayload?: any;
  createdAt: Date;
  updatedAt: Date;
};

export const ShipmentModel = prisma.shipment;

export default ShipmentModel;
