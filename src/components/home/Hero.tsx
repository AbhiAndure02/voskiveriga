"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="flex min-h-[82vh] items-center justify-center bg-slate-950 px-4 py-20 text-center text-white">
      <div className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          Salt-free water technology
        </div>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Protect your pipes from hard water limescale
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
          Voskiveriga helps reduce scale buildup in taps, geysers, and plumbing
          without salt, water waste, or regular maintenance.
        </p>

        <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-sm text-slate-300 sm:grid-cols-3">
          <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>No salt</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>No water waste</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>Low maintenance</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
          >
            View Products
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-500/50 hover:text-white sm:w-auto"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
