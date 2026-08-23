import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteContactSchema } from "@/schemas/contact.schema";
import { ZodError } from "zod";

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { id } = deleteContactSchema.parse(body);

        await prisma.contact.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Contact deleted" });
    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: "Validation error", errors: error.issues },
                { status: 422 }
            );
        }

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
