import Link from "next/link";
import Hero from "../components/home/Hero";
import { Award, ShieldCheck, Tag, Truck } from "lucide-react";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Salt-free protection",
    text: "Helps reduce hard-water scale without salt or chemical refills.",
  },
  {
    icon: Truck,
    title: "Pan-India delivery",
    text: "Order support and shipment tracking available after dispatch.",
  },
  {
    icon: Award,
    title: "Warranty support",
    text: "Get help with product selection, installation, and warranty queries.",
  },
  {
    icon: Tag,
    title: "Bulk enquiries",
    text: "Contact the team for home, commercial, or business requirements.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Hero />

      <section className="border-y border-slate-800 bg-slate-900/60 px-4 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Need the right descaler for your site?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Share your pipe size, water usage, and application. We will guide you
          to the right Voskiveriga solution.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Contact Support
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-white"
          >
            View Products
          </Link>
        </div>
      </section>
    </main>
  );
}
