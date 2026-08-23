import prisma from '@/lib/prisma';

export type ICategory = {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const CategoryModel = prisma.category;

export default CategoryModel;
