export interface CouponEmailParams {
  userName?: string;
  userEmail: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  validUntil: string | Date;
  customMessage?: string;
  shopUrl?: string;
}

export const couponEmailTemplate = ({
  userName,
  userEmail,
  code,
  description,
  discountType,
  discountValue,
  minOrderAmount = 0,
  maxDiscount,
  validUntil,
  customMessage,
  shopUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000',
}: CouponEmailParams): string => {
  const formattedDiscount =
    discountType === 'percentage'
      ? `${discountValue}% OFF`
      : `₹${discountValue.toLocaleString('en-IN')} OFF`;

  const expiryString = new Date(validUntil).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Special Coupon Gift for You!</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #0f172a;
            color: #f8fafc;
          }
          .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #0f172a;
            padding: 40px 0;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #1e293b;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #334155;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          }
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%);
            padding: 32px 24px;
            text-align: center;
          }
          .brand-logo {
            font-size: 24px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .brand-sub {
            font-size: 12px;
            color: #93c5fd;
            letter-spacing: 2px;
            margin-top: 4px;
          }
          .content {
            padding: 32px 28px;
          }
          .greeting {
            font-size: 20px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 12px;
          }
          .intro-text {
            font-size: 15px;
            line-height: 1.6;
            color: #cbd5e1;
            margin-bottom: 24px;
          }
          .custom-msg {
            background-color: #0f172a;
            border-left: 4px solid #3b82f6;
            padding: 14px 18px;
            border-radius: 6px;
            font-style: italic;
            color: #94a3b8;
            margin-bottom: 24px;
            font-size: 14px;
          }
          .voucher-card {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            border: 2px dashed #3b82f6;
            border-radius: 14px;
            padding: 24px;
            text-align: center;
            margin-bottom: 28px;
            position: relative;
          }
          .discount-badge {
            display: inline-block;
            background: linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%);
            color: #ffffff;
            font-size: 13px;
            font-weight: 800;
            padding: 6px 14px;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
          }
          .code-box {
            background-color: #020617;
            border: 1px solid #334155;
            padding: 14px 20px;
            border-radius: 10px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 28px;
            font-weight: 900;
            color: #38bdf8;
            letter-spacing: 4px;
            margin: 12px 0;
            display: block;
          }
          .terms-list {
            font-size: 13px;
            color: #94a3b8;
            line-height: 1.6;
            text-align: left;
            background: #0f172a;
            padding: 16px;
            border-radius: 8px;
            margin-top: 16px;
          }
          .terms-list li {
            margin-bottom: 4px;
          }
          .cta-btn {
            display: inline-block;
            width: 80%;
            max-width: 280px;
            background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            padding: 14px 24px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
            margin: 0 auto;
          }
          .footer {
            background-color: #0f172a;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #334155;
          }
          .footer a {
            color: #38bdf8;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="brand-logo">Voskiveriga Water Tech</div>
              <div class="brand-sub">EXCLUSIVE REWARDS & PROMOTIONS</div>
            </div>

            <!-- Main Content -->
            <div class="content">
              <div class="greeting">Hello ${userName || userEmail.split('@')[0]}! 🎉</div>
              
              <div class="intro-text">
                We're excited to offer you an exclusive promotional discount code! You can use this discount voucher on your next purchase at Voskiveriga Water Tech.
              </div>

              ${customMessage ? `<div class="custom-msg">"${customMessage}"</div>` : ''}

              <!-- Voucher Ticket Card -->
              <div class="voucher-card">
                <div class="discount-badge">SPECIAL OFFER &bull; ${formattedDiscount}</div>
                <div style="font-size: 14px; color: #e2e8f0; font-weight: 600;">${description}</div>
                
                <span class="code-box">${code}</span>
                
                <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
                  Use this coupon code at checkout to claim your discount!
                </div>

                <div class="terms-list">
                  <ul style="margin: 0; padding-left: 20px;">
                    ${minOrderAmount > 0 ? `<li>Minimum purchase required: <strong>₹${minOrderAmount.toLocaleString('en-IN')}</strong></li>` : '<li>No minimum purchase required!</li>'}
                    ${discountType === 'percentage' && maxDiscount ? `<li>Maximum discount cap: <strong>₹${maxDiscount.toLocaleString('en-IN')}</strong></li>` : ''}
                    <li>Offer valid until: <strong style="color: #f43f5e;">${expiryString}</strong></li>
                  </ul>
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 12px;">
                <a href="${shopUrl}/cart" class="cta-btn">Shop Now & Apply Code</a>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="margin: 0 0 8px 0;">Need assistance? Contact our support team at voskiveriga@gmail.com</p>
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Voskiveriga Water Tech. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
