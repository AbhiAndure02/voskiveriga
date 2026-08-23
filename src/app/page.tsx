import Link from 'next/link';
import Hero from '../components/home/Hero';
import ProductShowcase from '../components/home/ProductShowcase';
import {
  ShieldCheck,
  Truck,
  Zap,
  Tag,
  Wrench,
  Cpu,
  Layers,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const industrialCategories = [
  { name: 'Water Treatment & Descalers', count: '42 Products', href: '/products?category=Descalers', icon: Zap },
  { name: 'Pumps & Motors', count: '85 Products', href: '/products?category=Pumps', icon: Layers },
  { name: 'Industrial Automation', count: '120 Products', href: '/products?category=Automation', icon: Cpu },
  { name: 'Safety Equipment & Gear', count: '64 Products', href: '/products?category=Safety', icon: ShieldCheck },
  { name: 'Tools & Hardware', count: '210 Products', href: '/products?category=Tools', icon: Wrench },
  { name: 'Fasteners & Fittings', count: '150 Products', href: '/products?category=Fasteners', icon: Tag },
];

export default function Home() {
  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Industrial Hero Banner */}
      <Hero />

      {/* Trust Badges Strip */}
      <section className="border-y border-slate-800 bg-slate-900/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-6 h-6 text-cyan-400 shrink-0" />
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">100% Genuine Industrial Goods</h4>
              <p className="text-xs text-slate-400">Direct from certified manufacturers</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Truck className="w-6 h-6 text-cyan-400 shrink-0" />
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Express Express Shipping</h4>
              <p className="text-xs text-slate-400">Powered by Shiprocket Logistics</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Award className="w-6 h-6 text-cyan-400 shrink-0" />
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">GST Invoicing Available</h4>
              <p className="text-xs text-slate-400">Save up to 18% with GST input credit</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Tag className="w-6 h-6 text-cyan-400 shrink-0" />
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Exclusive Bulk Coupons</h4>
              <p className="text-xs text-slate-400">Save big on enterprise orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Categories Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Product Catalog
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Popular Industrial Categories</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {industrialCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 flex items-center justify-center mb-3 transition duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-400 transition line-clamp-2">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-500 mt-1">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Industrial Showcase */}
      <ProductShowcase />

      {/* Promotional Discount Callout Banner */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-8 md:p-12 overflow-hidden border border-blue-800 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-cyan-300 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 border border-blue-400/30">
              <Tag className="w-3.5 h-3.5" />
              SPECIAL ENTERPRISE PROMOTION
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              Get Up to ₹2,000 OFF on Industrial AquaShield Orders
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
              Use promo code <span className="font-mono font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-cyan-500/40">VOSK10</span> or <span className="font-mono font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-cyan-500/40">DESCALER2000</span> at checkout to claim instant discounts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cart"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition"
              >
                Go to Cart & Apply Coupon
              </Link>
              <Link
                href="/products"
                className="px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-white font-bold rounded-xl text-sm border border-slate-700 transition"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}