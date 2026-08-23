import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(contacts.map((c) => ({ ...c, _id: c.id })));
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch contacts" },
            { status: 500 }
        );
    }
}
