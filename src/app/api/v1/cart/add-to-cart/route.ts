import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addToCartSchema } from "@/schemas/cart.schema";
import { ZodError } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, productId, quantity } = addToCartSchema.parse(body);

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId,
                    items: {
                        create: [
                            {
                                productId,
                                quantity,
                                price: product.price,
                            },
                        ],
                    },
                },
                include: { items: { include: { product: true } } },
            });
        } else {
            const existingItem = cart.items.find((i) => i.productId === productId);
            if (existingItem) {
                await prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + quantity },
                });
            } else {
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId,
                        quantity,
                        price: product.price,
                    },
                });
            }

            cart = await prisma.cart.findUnique({
                where: { userId },
                include: { items: { include: { product: true } } },
            });
        }

        const totalQuantity = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
        const totalPrice = cart?.items.reduce((sum, item) => sum + item.quantity * item.price, 0) || 0;

        const updatedCart = await prisma.cart.update({
            where: { id: cart!.id },
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

        console.error("Add to cart error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
