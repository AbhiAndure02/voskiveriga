import nodemailer from "nodemailer";

/**
 * Send Email Utility via Nodemailer Gmail SMTP
 */
export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error(
      "Email credentials (EMAIL_USER and EMAIL_PASS) are missing from environment variables."
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Voskiveriga Water Tech" <${emailUser}>`,
      to,
      subject,
      html,
    });
  } catch (error: any) {
    console.error("Nodemailer Email Delivery Failed:", error);
    if (error?.responseCode === 535 || error?.message?.includes("535")) {
      throw new Error(
        "Gmail Authentication Failed (535 Bad Credentials). Please use a 16-character Google App Password in EMAIL_PASS instead of your normal account password. Enable 2-Step Verification on your Google Account and generate an App Password at: https://myaccount.google.com/apppasswords"
      );
    }
    throw error;
  }
};
