'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
        if (data.data.awbCode || data.data.orderNumber) {
          fetchTracking(data.data.awbCode || data.data.orderNumber);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTracking = async (trackingId: string) => {
    try {
      const res = await fetch(`/api/shipping/track?id=${encodeURIComponent(trackingId)}`);
      const data = await res.json();
      if (data.success) {
        setTracking(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full">
          <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-slate-400 text-xs mb-6">The requested order ID could not be located.</p>
          <Link href="/products" className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Link */}
        <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        {/* Order Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ORDER CONFIRMED</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Order #{order.orderNumber}</h1>
              <p className="text-xs text-slate-400 mt-1">Placed on {new Date(order.createdAt).toLocaleString('en-IN')}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-full">
                Payment: {order.paymentStatus}
              </span>
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-cyan-400 font-bold text-xs rounded-full">
                Status: {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Shiprocket Logistics Tracking Timeline */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                Shiprocket Live Tracking Status
              </h3>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Track on Courier Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Courier Name</span>
                <span className="font-bold text-white">{order.courierName || 'Bluedart Express'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">AWB Code</span>
                <span className="font-mono font-bold text-cyan-400">{order.awbCode || 'Generating AWB...'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Est. Delivery</span>
                <span className="font-bold text-emerald-400">{tracking?.estimated_delivery_date || '2-3 Business Days'}</span>
              </div>
            </div>

            {/* Tracking Steps */}
            {tracking?.tracking_history && (
              <div className="pt-2 space-y-3">
                {tracking.tracking_history.map((step: any, idx: number) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{step.status}</h4>
                      <p className="text-slate-400 text-[11px]">{step.activity} - <span className="text-slate-500">{step.location}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Items & Invoice Snapshot */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Purchased Products</h3>
            <div className="space-y-3">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />}
                    <div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <span className="text-slate-500">SKU: {item.sku} &bull; Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-white text-sm">₹{item.subtotal.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Totals Summary */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs max-w-xs ml-auto">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-white font-semibold">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount:</span>
                  <span className="font-semibold">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Express Shipping:</span>
                <span className="text-white font-semibold">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white border-t border-slate-800 pt-2">
                <span>Total Amount Paid:</span>
                <span className="text-cyan-400">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
