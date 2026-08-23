interface Props {
    name: string;
}

export const ContactAutoReplyTemplate = ({ name }: Props) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Thank You for Your Enquiry</h2>
    <p>Hi ${name},</p>

    <p>
      Thank you for contacting <strong>Voskiveriga</strong>.
      We have received your enquiry and our team will review it shortly.
    </p>

    <p>
      One of our representatives will get back to you as soon as possible.
    </p>

    <p>
      If your matter is urgent, please feel free to reply to this email.
    </p>

    <br />

    <p>
      Best regards,<br />
      <strong>Voskiveriga Support Team</strong>
    </p>
  </div>
`;
