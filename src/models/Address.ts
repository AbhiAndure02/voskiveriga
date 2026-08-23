import prisma from '@/lib/prisma';

export type IAddress = {
  id: string;
  _id?: string;
  userId: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const AddressModel = prisma.address;

export default AddressModel;
