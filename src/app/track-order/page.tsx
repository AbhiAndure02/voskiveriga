"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Truck, Search, ShieldCheck } from "lucide-react";
import { getShiprocketTracking, ShiprocketTrackingResponse } from "@/lib/shiprocket";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";

  const [searchId, setSearchId] = useState(initialOrderId);
  const [trackingData, setTrackingData] = useState<ShiprocketTrackingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      handleTrack(initialOrderId);
    }
  }, [initialOrderId]);

  const handleTrack = async (idToTrack: string) => {
    if (!idToTrack.trim()) return;
    setIsLoading(true);
    try {
      const data = await getShiprocketTracking(idToTrack);
      setTrackingData(data);
    } catch (e) {
      console.error("Tracking error", e);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(searchId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4 text-cyan-400" />
            Shiprocket Express Logistics Network
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
            Track Your Voskiveriga Order
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Enter your Voskiveriga Order ID or Shiprocket AWB Tracking Number below to check live shipment status.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl">
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. VOSK-ORD-849201 or AWB)"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 pl-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-4" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="py-4 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-cyan-500/25 shrink-0"
            >
              {isLoading ? "Fetching..." : "Track Order"}
            </button>
          </form>
        </div>

        {/* Tracking Results Card */}
        {trackingData && (
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Shipment Summary Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
              <div>
                <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Shipment Status</div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">{trackingData.current_status}</h3>
                <div className="text-xs text-slate-400 mt-1">
                  Courier Partner: <strong className="text-slate-200">{trackingData.courier_name}</strong>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs space-y-1 font-mono">
                <div className="text-slate-400">Order ID: <span className="text-white font-bold">{trackingData.order_id}</span></div>
                <div className="text-slate-400">AWB Code: <span className="text-cyan-400 font-bold">{trackingData.awb_code}</span></div>
                <div className="text-slate-400">Est. Delivery: <span className="text-emerald-400 font-bold">{trackingData.estimated_delivery_date}</span></div>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Tracking Timeline</h4>
              
              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {trackingData.tracking_history.map((step, idx) => (
                  <div key={idx} className="relative flex gap-4 items-start pl-10">
                    <div className={`absolute left-2.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                      idx === trackingData.tracking_history.length - 1
                        ? "bg-cyan-400 border-cyan-300 ring-4 ring-cyan-500/20"
                        : "bg-slate-800 border-slate-700"
                    }`} />
                    
                    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex-1 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-cyan-300">{step.status}</span>
                        <span className="text-slate-500">{step.date}</span>
                      </div>
                      <div className="text-xs font-semibold text-white">{step.location}</div>
                      <p className="text-xs text-slate-400">{step.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support footer */}
            <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected by Voskiveriga 2-Year Replacement Guarantee</span>
              </div>
              <a href="/contact" className="text-cyan-400 font-semibold hover:underline">
                Need Help? Contact Support →
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-cyan-400 font-bold animate-pulse">Loading Voskiveriga Tracking Portal...</div>
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
