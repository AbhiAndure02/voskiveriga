import "./globals.css";
import type { Metadata } from "next";
import LayoutWrapper from "@/components/home/LayoutWrapper";
import ReduxProvider from "@/providers/ReduxProvider";

export const metadata: Metadata = {
  title: "Voskiveriga | Electromagnetic Water Descalers & Eco Hard Water Solutions",
  description: "Voskiveriga - Advanced Electromagnetic Water Descalers for Home, Commercial & Industrial scale protection without salts or chemicals.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-zinc-50 dark:bg-black">
        <ReduxProvider>

          <LayoutWrapper>{children}</LayoutWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
