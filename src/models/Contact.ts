import prisma from "@/lib/prisma";

export type Contact = {
    id: string;
    _id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
};

export const ContactModel = prisma.contact;

export default ContactModel;
