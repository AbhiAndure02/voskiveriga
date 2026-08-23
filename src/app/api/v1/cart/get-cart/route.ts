import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCartSchema } from "@/schemas/cart.schema";
import { ZodError } from "zod";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        const { userId: validatedUserId } = getCartSchema.parse({ userId });

        const cart = await prisma.cart.findUnique({
            where: { userId: validatedUserId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart) {
            return NextResponse.json(
                { items: [], totalQuantity: 0, totalPrice: 0 },
                { status: 200 }
            );
        }

        return NextResponse.json({
            ...cart,
            user: cart.userId,
            items: cart.items.map((i) => ({
                ...i,
                product: { ...i.product, _id: i.product.id },
            })),
        }, { status: 200 });

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

        console.error("Get cart error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
