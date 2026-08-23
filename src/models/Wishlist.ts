import prisma from '@/lib/prisma';

export type IWishlist = {
  id: string;
  _id?: string;
  userId: string;
  productIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

export const WishlistModel = prisma.wishlist;

export default WishlistModel;
