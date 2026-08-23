import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { addressSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('User ID is required', 'USER_ID_REQUIRED', 400);
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    return successResponse(addresses.map((a) => ({ ...a, _id: a.id })), 'Addresses fetched successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch addresses', 'ADDRESS_FETCH_ERROR', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, ...addressData } = body;

    if (!userId) {
      return errorResponse('User ID is required', 'USER_ID_REQUIRED', 400);
    }

    const validatedData = addressSchema.parse(addressData);

    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        ...validatedData,
      },
    });

    return successResponse({ ...newAddress, _id: newAddress.id }, 'Address saved successfully', 201);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to save address', 'ADDRESS_SAVE_ERROR', 400);
  }
}
