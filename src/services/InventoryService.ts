import prisma from '@/lib/prisma';
import { NotFoundError } from '@/lib/errors/customErrors';

export class InventoryService {
  /**
   * Fetch inventory items with stock status filter
   */
  static async getInventory(statusFilter: 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'ALL') {
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        brand: true,
        price: true,
        stock: true,
        lowStockThreshold: true,
        unit: true,
        isActive: true,
      },
      orderBy: { stock: 'asc' },
    });

    let filteredProducts = allProducts;
    if (statusFilter === 'OUT_OF_STOCK') {
      filteredProducts = allProducts.filter((p: { stock: number; }) => p.stock === 0);
    } else if (statusFilter === 'LOW_STOCK') {
      filteredProducts = allProducts.filter((p: { stock: number; lowStockThreshold: number; }) => p.stock > 0 && p.stock <= p.lowStockThreshold);
    } else if (statusFilter === 'IN_STOCK') {
      filteredProducts = allProducts.filter((p: { stock: number; lowStockThreshold: number; }) => p.stock > p.lowStockThreshold);
    }

    const totalProducts = allProducts.length;
    const outOfStockCount = allProducts.filter((p: { stock: number; }) => p.stock === 0).length;
    const lowStockCount = allProducts.filter((p: { stock: number; lowStockThreshold: number; }) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;

    return {
      products: filteredProducts,
      stats: {
        totalProducts,
        inStockCount: totalProducts - outOfStockCount - lowStockCount,
        lowStockCount,
        outOfStockCount,
      },
    };
  }

  /**
   * Update stock quantity for a product
   */
  static async updateStock(productId: string, newStock: number) {
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }

    try {
      const product = await prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });
      return product;
    } catch {
      throw new NotFoundError('Product not found');
    }
  }
}
