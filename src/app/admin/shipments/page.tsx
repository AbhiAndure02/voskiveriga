'use client';

import { useState, useEffect } from 'react';
import {
  Truck,
  Send,
  ExternalLink,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AdminShipmentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders?status=SHIPPED');
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
      (o.awbCode && o.awbCode.toLowerCase().includes(search.toLowerCase())) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>LOGISTICS & COURIERS MANAGEMENT</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Shiprocket Logistics</h1>
          <p className="text-slate-300 text-sm mt-1">Track dispatched courier parcels, AWB numbers, and delivery timelines.</p>
        </div>

        <button
          onClick={fetchShipments}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow transition text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Shipments</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by AWB code or order #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Shipments Grid/Table */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading Shiprocket logistics status...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No active shipments found</h3>
          <p className="text-slate-500 text-xs mt-1">Dispatched orders with AWBs will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Courier Partner</th>
                  <th className="px-6 py-4">AWB Code</th>
                  <th className="px-6 py-4">Shipment Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-xs text-slate-500">{order.shippingAddress?.city}, {order.shippingAddress?.state} ({order.shippingAddress?.postalCode})</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{order.courierName || 'Bluedart Express'}</td>
                    <td className="px-6 py-4 font-mono font-bold text-cyan-600">{order.awbCode || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider bg-blue-100 text-blue-700">
                        <Truck className="w-3 h-3" /> {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.trackingUrl && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <span>Track Package</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
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
