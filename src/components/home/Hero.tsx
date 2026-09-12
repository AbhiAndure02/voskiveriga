"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Droplet, CheckCircle2, Star, Sparkles, Flame } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white pt-10 pb-20"
    >
      {/* Background Animated Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-600/20 via-blue-600/15 to-indigo-600/10 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/15 via-indigo-600/15 to-cyan-500/20 blur-[120px]"
          animate={{ scale: [1.2, 1, 1.2], rotate: [180, 270, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left Column: Text & Hero CTA */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            Next-Gen Salt-Free Hard Water Descaler
            <span className="bg-cyan-500/20 px-2 py-0.5 rounded-md text-[10px] text-cyan-200">2-Yr Warranty</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Say Goodbye to <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Hard Water Limescale
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
            <strong>Voskiveriga</strong> electromagnetic water descalers emit computerized high-frequency signal pulses to stop limescale in taps, geysers, and pipes. <span className="text-cyan-300 font-semibold">100% Salt-Free • 0 Water Wastage • 0 Maintenance</span>
          </p>

          {/* Key Value Pill Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/70 border border-slate-800 px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>0% Salt Maintenance</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/70 border border-slate-800 px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Saves 40% Heating Gas/Elec</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/70 border border-slate-800 px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>DIY 15-Min Pipe Wrap</span>
            </div>
          </div>

          {/* CTA Buttons & Shiprocket Tag */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
            <Link
              href="/cart"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all"
            >
              Buy Voskiveriga (₹8,999)
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="#calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition"
            >
              Calculate ROI & Savings →
            </Link>
          </div>

          {/* Ratings & Social Proof */}
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 border-t border-slate-900">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs ring-2 ring-slate-950">A</div>
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs ring-2 ring-slate-950">R</div>
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-xs ring-2 ring-slate-950">V</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-yellow-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <span className="text-white ml-1">4.9/5</span>
              </div>
              <p className="text-[11px] text-slate-400">Over 12,000+ Homes Protected across India</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
