interface Props {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const ContactMailTemplate = ({
    name,
    email,
    subject,
    message,
}: Props) => `
  <div style="font-family: Arial, sans-serif;">
    <h2>📩 New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <hr />
    <p>${message}</p>
  </div>
`;
