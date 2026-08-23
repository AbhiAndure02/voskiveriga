import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addContactSchema } from "@/schemas/contact.schema";
import { sendContactMail } from "@/lib/ContactMail";
import { ZodError } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = addContactSchema.parse(body);

        const contact = await prisma.contact.create({
            data,
        });

        await sendContactMail(data);

        return NextResponse.json(
            { message: "Message sent successfully", contact: { ...contact, _id: contact.id } },
            { status: 201 }
        );
    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: "Validation error", errors: error.issues },
                { status: 422 }
            );
        }

        console.error("Add contact error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
