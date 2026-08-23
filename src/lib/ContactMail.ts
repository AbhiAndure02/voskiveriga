import nodemailer from "nodemailer";
import { ContactMailTemplate } from "../templates/contactMailTemplate";
import { ContactAutoReplyTemplate } from "../templates/ContactAutoReplyTemplate";

interface SendMailProps {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const sendContactMail = async (data: SendMailProps) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    /* =========================
       ADMIN EMAIL
    ========================= */
    await transporter.sendMail({
        from: `"Voskiveriga" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `📩 New Enquiry: ${data.subject}`,
        html: ContactMailTemplate(data),
    });

    /* =========================
       USER AUTO-REPLY
    ========================= */
    await transporter.sendMail({
        from: `"Voskiveriga" <${process.env.EMAIL_USER}>`,
        to: data.email,
        subject: "Thank You for Your Enquiry – Voskiveriga Water Tech",
        html: ContactAutoReplyTemplate({ name: data.name }),
    });
};
