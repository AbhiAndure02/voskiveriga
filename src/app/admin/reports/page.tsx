'use client';

import { useState, useEffect } from 'react';
import { BarChart, TrendingUp, DollarSign, RefreshCw, Sparkles, PieChart } from 'lucide-react';

export default function AdminReportsPage() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.success) {
        setMetrics(data.data.metrics);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>BUSINESS ANALYTICS & REPORTS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Sales & Revenue Reports</h1>
          <p className="text-slate-300 text-sm mt-1">Export executive sales summary, coupon redemption impacts, and category breakdowns.</p>
        </div>

        <button
          onClick={fetchMetrics}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow transition text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Reports</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Revenue Summary
          </h3>
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Lifetime Revenue:</span>
              <span className="font-extrabold text-slate-900">₹{metrics?.totalRevenue?.toLocaleString('en-IN') || 0}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Today's Sales:</span>
              <span className="font-extrabold text-emerald-600">₹{metrics?.todayRevenue?.toLocaleString('en-IN') || 0}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Orders Placed:</span>
              <span className="font-bold text-slate-900">{metrics?.totalOrders || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-600" /> Coupon & Offer Analytics
          </h3>
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Active Vouchers:</span>
              <span className="font-bold text-slate-900">{metrics?.totalCoupons || 0}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Pending Logistics Shipments:</span>
              <span className="font-bold text-amber-600">{metrics?.pendingShipments || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
