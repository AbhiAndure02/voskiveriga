'use client';

import { useState } from 'react';
import { Settings, Save, Sparkles, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const [store, setStore] = useState({
    name: 'Voskiveriga Water Tech',
    email: 'voskiveriga@gmail.com',
    phone: '+91 98765 43210',
    gstNumber: '29ABCDE1234F1Z5',
    defaultTaxRate: '18',
    shippingFlatFee: '100',
    freeShippingThreshold: '5000',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Store settings saved successfully!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>PLATFORM CONFIGURATION</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Store & GST Settings</h1>
          <p className="text-slate-300 text-sm mt-1">Configure company details, GST tax rates, and default logistics parameters.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-3xl shadow-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Store Name *</label>
              <input
                type="text"
                required
                value={store.name}
                onChange={(e) => setStore({ ...store, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">GST Number</label>
              <input
                type="text"
                value={store.gstNumber}
                onChange={(e) => setStore({ ...store, gstNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Support Email *</label>
              <input
                type="email"
                required
                value={store.email}
                onChange={(e) => setStore({ ...store, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Support Phone *</label>
              <input
                type="text"
                required
                value={store.phone}
                onChange={(e) => setStore({ ...store, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Default GST Rate (%)</label>
              <input
                type="number"
                value={store.defaultTaxRate}
                onChange={(e) => setStore({ ...store, defaultTaxRate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Standard Shipping (₹)</label>
              <input
                type="number"
                value={store.shippingFlatFee}
                onChange={(e) => setStore({ ...store, shippingFlatFee: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Free Shipping Min (₹)</label>
              <input
                type="number"
                value={store.freeShippingThreshold}
                onChange={(e) => setStore({ ...store, freeShippingThreshold: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition flex items-center gap-2 shadow"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
