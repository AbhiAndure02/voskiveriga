'use client';

import Link from 'next/link';
import { 
  Droplet, 
  Truck, 
  Zap, 
  RotateCcw, 
  Mail, 
  Phone, 
  MapPin, 
  Award,
  Lock
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Value Proposition Bar */}
      <div className="border-b border-slate-900 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm">0 Salts / 0 Chemicals</h5>
              <p className="text-xs text-slate-500">Pure electromagnetic pulse science</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm">Shiprocket Express</h5>
              <p className="text-xs text-slate-500">Free delivery across all Indian pin codes</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm">5-Year Guarantee</h5>
              <p className="text-xs text-slate-500">Full replacement warranty & support</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm">Razorpay Secure</h5>
              <p className="text-xs text-slate-500">UPI, Credit/Debit & COD protection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Droplet className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">VOSKIVERIGA</span>
          </div>

          <p className="text-sm leading-relaxed text-slate-400 max-w-md">
            Voskiveriga is India's leading electromagnetic water descaler technology brand. We protect homes, commercial establishments, and industries from stubborn hard water limescale without salt, maintenance, or water wastage.
          </p>

          <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-medium">
              Salt-Free Water Treatment
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-blue-400 font-medium">
              Made In India Tech
            </span>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Products</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/products" className="hover:text-cyan-400 transition">Voskiveriga AquaShield (Home 1")</Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-cyan-400 transition">HydroPulse Pro (Villa 1.5")</Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-cyan-400 transition">TitanScale (Industrial 2-4")</Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-cyan-400 transition">Copper Signal Coils & Spare Parts</Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/track-order" className="hover:text-cyan-400 transition flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                Track Shiprocket Order
              </Link>
            </li>
            <li>
              <Link href="/#calculator" className="hover:text-cyan-400 transition">Hard Water Savings Calculator</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-cyan-400 transition">Our Technology & Mission</Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-cyan-400 transition">Privacy Policy & Warranty</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-cyan-400 transition">Contact & Support</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Support & Helpline</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>+91 88068 99797</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>+91 82610 66737</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>voskiveriga@gmail.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Ground Floor, Vakratund Residency, Jagdamba Chowk, Malwadi, Wadgaonsheri, Pune 411014</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-center text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {currentYear} Voskiveriga Technology Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Razorpay Payment Gateway</span>
            <span>•</span>
            <span>Shiprocket Courier Network</span>
            <span>•</span>
            <span>100% Eco-Friendly Water Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
