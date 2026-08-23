import type { ReactNode } from "react";
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: "About Us | Voskiveriga Electromagnetic Water Tech",
  description:
    "Learn more about Voskiveriga — India's leading salt-free electromagnetic water descaler technology.",
};

export default function AboutLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-white text-gray-900">
      {/* Optional section-level wrapper */}
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
}
