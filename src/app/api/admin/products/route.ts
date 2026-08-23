import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { productSchema } from '@/lib/validation/schemas';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const where: Prisma.ProductWhereInput = {};
    if (search) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { sku: { contains: term, mode: 'insensitive' } },
        { category: { contains: term, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { specifications: true },
    });

    return successResponse(products.map((p) => ({ ...p, _id: p.id })), 'Admin products fetched successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch products', 'ADMIN_PRODUCTS_ERROR', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    const slug = validatedData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { specifications, ...productData } = validatedData;

    const newProduct = await prisma.product.create({
      data: {
        ...productData,
        slug,
        sku: validatedData.sku.toUpperCase(),
        specifications: specifications
          ? {
              create: specifications.map((s) => ({ key: s.key, value: s.value })),
            }
          : undefined,
      },
      include: { specifications: true },
    });

    return successResponse({ ...newProduct, _id: newProduct.id }, 'Product created successfully!', 201);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return errorResponse(error.message || 'Failed to create product', 'PRODUCT_CREATE_ERROR', 400);
  }
}
