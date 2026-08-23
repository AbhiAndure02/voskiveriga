export const otpEmailTemplate = (otp: string, name?: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9fafb;
            padding: 20px;
          }
          .container {
            max-width: 500px;
            margin: auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
          }
          .otp {
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 6px;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello ${name || "User"},</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <div class="footer">
            © ${new Date().getFullYear()} Voskiveriga Water Tech
          </div>
        </div>
      </body>
    </html>
  `;
};
