'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  DollarSign,
  Sparkles,
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders?status=ALL');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(search.toLowerCase())) ||
      (o.razorpayOrderId && o.razorpayOrderId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>RAZORPAY FINANCIAL AUDIT</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Payments & Transactions</h1>
          <p className="text-slate-300 text-sm mt-1">Audit online payment transaction IDs, Razorpay order IDs, and payment verification status.</p>
        </div>

        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow transition text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Payments</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Razorpay Payment ID or Order #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading payment transaction logs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No payment logs found</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Razorpay Payment ID</th>
                  <th className="px-6 py-4">Razorpay Order ID</th>
                  <th className="px-6 py-4 text-right">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">{order.orderNumber}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{order.customerName}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">₹{order.total?.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-slate-600 uppercase text-xs font-bold">{order.paymentMethod || 'razorpay'}</td>
                    <td className="px-6 py-4 font-mono text-xs text-emerald-600 font-bold">{order.razorpayPaymentId || 'N/A'}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{order.razorpayOrderId || 'N/A'}</td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
