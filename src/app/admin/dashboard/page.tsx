'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Send,
  Ticket,
  Clock,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.success) {
        setMetrics(data.data.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-sm font-medium">Loading admin dashboard statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>EXECUTIVE DASHBOARD</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Industrial Commerce Overview</h1>
          <p className="text-slate-300 text-sm mt-1">Real-time revenue, order fulfillment status, inventory alerts, and customer insights.</p>
        </div>

        <button
          onClick={fetchDashboardMetrics}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow transition text-sm self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">₹{metrics?.totalRevenue?.toLocaleString('en-IN') || 0}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Lifetime Paid Revenue
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{metrics?.totalOrders || 0}</h3>
            <p className="text-xs text-blue-600 font-medium mt-1">Today: {metrics?.todayOrdersCount || 0} orders</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Shipments</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{metrics?.pendingShipments || 0}</h3>
            <p className="text-xs text-amber-600 font-medium mt-1">Ready for Shiprocket</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Alerts</p>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{metrics?.lowStockProducts || 0}</h3>
            <p className="text-xs text-rose-600 font-medium mt-1">Action required</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Total Registered Customers</h4>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{metrics?.totalCustomers || 0}</p>
          <p className="text-xs text-slate-500">Verified buyers & business accounts</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Active Products Catalog</h4>
            <Package className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{metrics?.totalProducts || 0}</p>
          <p className="text-xs text-slate-500">Industrial products with SKUs</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Promotional Vouchers</h4>
            <Ticket className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{metrics?.totalCoupons || 0}</p>
          <p className="text-xs text-slate-500">Configured coupon promotions</p>
        </div>
      </div>
    </div>
  );
}
