'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LimescaleCalculator() {
  const [householdMembers, setHouseholdMembers] = useState(4);
  const [tdsLevel, setTdsLevel] = useState(800); // PPM TDS

  // Calculations
  // Salt softener cost per year: approx ₹1,200/month salt + ₹300 electricity + ₹500 water waste = ~₹24,000/yr
  // Plumbing repair risk from scale: ~₹15,000/yr
  const annualSaltSoftenerCost = Math.round(householdMembers * 4200 + tdsLevel * 8);
  const annualGeyserEnergyLoss = Math.round(tdsLevel * 12.5); // scale causes 20-40% higher heating bill
  const totalAnnualSavings = annualSaltSoftenerCost + annualGeyserEnergyLoss;

  return (
    <section id="calculator" className="py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-4 h-4 text-cyan-400" />
            ROI & Savings Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
            See How Much Money Voskiveriga Saves You
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Hard water scale increases electricity bills by 30% and ruins expensive taps, geysers, & washing machines. Voskiveriga pays for itself in less than 6 months!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-8">
            {/* Household Members */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-200">
                  Household Members: <span className="text-cyan-400 font-bold text-lg">{householdMembers} People</span>
                </label>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                value={householdMembers}
                onChange={(e) => setHouseholdMembers(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1 Person</span>
                <span>6 People</span>
                <span>12+ People</span>
              </div>
            </div>

            {/* TDS Water Hardness Level */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-200">
                  Water Hardness / TDS Level: <span className="text-cyan-400 font-bold text-lg">{tdsLevel} PPM</span>
                </label>
              </div>
              <input
                type="range"
                min={200}
                max={2500}
                step={50}
                value={tdsLevel}
                onChange={(e) => setTdsLevel(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>200 PPM (Moderate)</span>
                <span>1,200 PPM (Hard)</span>
                <span>2,500 PPM (Extreme)</span>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Salt Bags to Buy or Transport Every Month</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Maintenance & 0 Liters Water Wastage</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Protects Geysers, Solar Heaters, Dishwashers & Piping</span>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 relative">
            <div className="absolute top-4 right-4">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-spin-slow" />
            </div>

            <h3 className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-2">Estimated Annual Savings</h3>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
              ₹{totalAnnualSavings.toLocaleString('en-IN')}{' '}
              <span className="text-sm font-normal text-slate-400">/ year</span>
            </div>

            <div className="my-6 border-t border-slate-800/80 pt-6 space-y-4 text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>Saved on Salt & Water Wastage:</span>
                <span className="font-semibold text-emerald-400">+₹{annualSaltSoftenerCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Heating Bill Energy Savings:</span>
                <span className="font-semibold text-cyan-400">+₹{annualGeyserEnergyLoss.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Plumbing & Appliance Life Extension:</span>
                <span className="font-semibold text-indigo-400">+5 to 8 Years</span>
              </div>
            </div>

            <div className="bg-cyan-950/40 border border-cyan-500/30 p-4 rounded-xl flex items-start gap-3 text-xs text-cyan-200">
              <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Unlike salt softeners that add sodium to your drinking water, <strong>Voskiveriga</strong> keeps natural healthy calcium & magnesium in water while preventing scaling.
              </span>
            </div>

            <a
              href="/cart"
              className="mt-6 w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition"
            >
              Order Voskiveriga AquaShield (₹8,999)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
