import React from "react";

export default function PrivacyPolicyPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-10 bg-gray-200 text-gray-800">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

            <p className="mb-4">
                This Privacy Policy describes how we collect, use, and protect your
                personal information when you visit or make a purchase from our website.
            </p>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                <p>
                    When you visit our website or purchase electronic devices from us, we
                    may collect the following information:
                </p>
                <ul className="list-disc pl-6 mt-2">
                    <li>Name, phone number, email address</li>
                    <li>Billing and shipping address</li>
                    <li>Payment-related information (processed securely by payment providers)</li>
                    <li>Device, browser, and usage information</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6">
                    <li>To process and deliver orders</li>
                    <li>To communicate about orders, products, and support</li>
                    <li>To improve our website and services</li>
                    <li>To comply with legal and regulatory requirements</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. Sharing of Information</h2>
                <p>
                    We do not sell or rent your personal information. We may share your
                    information with trusted third parties such as payment gateways,
                    shipping partners, and service providers only as necessary to operate
                    our business.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
                <p>
                    We implement appropriate security measures to protect your personal
                    information. However, no method of transmission over the internet is
                    100% secure.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
                <p>
                    Our website may use cookies to enhance user experience, analyze traffic,
                    and improve our services. You can choose to disable cookies through
                    your browser settings.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
                <p>
                    You have the right to access, update, or request deletion of your
                    personal information. Please contact us for any privacy-related
                    requests.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">7. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Changes will be
                    posted on this page with an updated effective date.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us
                    at:
                </p>
                <p className="mt-2">
                    <strong>Email:</strong> voskiveriga@gmail.com
                </p>
            </section>
        </main>
    );
}
