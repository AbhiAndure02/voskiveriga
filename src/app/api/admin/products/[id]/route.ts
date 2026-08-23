import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return errorResponse('Product not found', 'PRODUCT_NOT_FOUND', 404);
    }

    const updateData: any = {};

    if (body.name) {
      updateData.name = body.name.trim();
      updateData.slug = body.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (body.sku) updateData.sku = body.sku.toUpperCase();
    if (body.description) updateData.description = body.description;
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
    if (body.category) updateData.category = body.category;
    if (body.brand) updateData.brand = body.brand;
    if (body.images) updateData.images = body.images;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.mrp !== undefined) updateData.mrp = Number(body.mrp);
    if (body.tax !== undefined) updateData.tax = Number(body.tax);
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.lowStockThreshold !== undefined) updateData.lowStockThreshold = Number(body.lowStockThreshold);
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.minimumOrderQuantity !== undefined) updateData.minimumOrderQuantity = Number(body.minimumOrderQuantity);
    if (body.tags) updateData.tags = body.tags;
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { specifications: true },
    });

    return successResponse({ ...updatedProduct, _id: updatedProduct.id }, 'Product updated successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update product', 'PRODUCT_UPDATE_ERROR', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deleted = await prisma.product.delete({ where: { id } });

    return successResponse({ ...deleted, _id: deleted.id }, 'Product deleted successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete product', 'PRODUCT_DELETE_ERROR', 500);
  }
}
