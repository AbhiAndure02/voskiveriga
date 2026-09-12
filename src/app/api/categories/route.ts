import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return successResponse(categories.map((c: any) => ({ ...c, _id: c.id })), 'Categories fetched successfully');
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return errorResponse(error.message || 'Failed to fetch categories', 'CATEGORY_FETCH_ERROR', 500);
  }
}
