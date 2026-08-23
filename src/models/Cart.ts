import prisma from "@/lib/prisma";

export interface CartItem {
    product: string;
    quantity: number;
    price: number;
}

export type Cart = {
    id: string;
    _id?: string;
    user: string;
    userId: string;
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
};

export const CartModel = prisma.cart;

export default CartModel;
