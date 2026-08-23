import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { removeFromCartSchema } from "@/schemas/cart.schema";
import { ZodError } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, productId } = removeFromCartSchema.parse(body);

        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });

        if (!cart) {
            return NextResponse.json(
                { message: "Cart not found" },
                { status: 404 }
            );
        }

        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                productId,
            },
        });

        const updatedItems = await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: { product: true },
        });

        const totalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

        const updatedCart = await prisma.cart.update({
            where: { id: cart.id },
            data: { totalQuantity, totalPrice },
            include: { items: { include: { product: true } } },
        });

        return NextResponse.json({ ...updatedCart, user: updatedCart.userId }, { status: 200 });

    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: error.issues,
                },
                { status: 422 }
            );
        }

        console.error("Remove cart item error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
