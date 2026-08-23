'use client';

import { useState, useEffect } from 'react';
import {
  Ticket,
  Plus,
  Send,
  Search,
  Filter,
  Copy,
  Check,
  Trash2,
  Edit,
  Clock,
  Users,
  Percent,
  DollarSign,
  AlertCircle,
  X,
  Sparkles,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

interface ICoupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  timesUsed: number;
  perUserLimit: number;
  targetedUsers: string[];
  isActive: boolean;
  createdAt: string;
}

interface IUserOption {
  _id: string;
  name: string;
  email: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalRedemptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderAmount: '0',
    maxDiscount: '',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: '500',
    perUserLimit: '1',
    targetedUsers: '',
    isActive: true,
  });

  const [sendData, setSendData] = useState({
    couponId: '',
    recipientEmails: '',
    sendToAllUsers: false,
    customMessage: '',
  });

  const [registeredUsers, setRegisteredUsers] = useState<IUserOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCoupons();
    fetchUsers();
  }, [search, statusFilter]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/coupons?search=${encodeURIComponent(search)}&status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error loading coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/v1/user/all');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setRegisteredUsers(data.users);
      }
    } catch (err) {
      // ignore user list load fail silently
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenCreate = (coupon?: ICoupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minOrderAmount: coupon.minOrderAmount ? coupon.minOrderAmount.toString() : '0',
        maxDiscount: coupon.maxDiscount ? coupon.maxDiscount.toString() : '',
        validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
        validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
        usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : '500',
        perUserLimit: coupon.perUserLimit ? coupon.perUserLimit.toString() : '1',
        targetedUsers: coupon.targetedUsers ? coupon.targetedUsers.join(', ') : '',
        isActive: coupon.isActive,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '0',
        maxDiscount: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: '500',
        perUserLimit: '1',
        targetedUsers: '',
        isActive: true,
      });
    }
    setIsCreateModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.description || !formData.discountValue || !formData.validUntil) {
      setAlertMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setAlertMessage(null);

    try {
      const url = editingCoupon
        ? `/api/v1/coupons/${editingCoupon._id}`
        : '/api/v1/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setAlertMessage({
          type: 'success',
          text: editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!',
        });
        setIsCreateModalOpen(false);
        fetchCoupons();
      } else {
        setAlertMessage({ type: 'error', text: data.message || 'Operation failed' });
      }
    } catch (err: any) {
      setAlertMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (coupon: ICoupon) => {
    try {
      const res = await fetch(`/api/v1/coupons/${coupon._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCoupons();
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/v1/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAlertMessage({ type: 'success', text: 'Coupon deleted successfully.' });
        fetchCoupons();
      }
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  const handleOpenSendModal = (coupon?: ICoupon) => {
    setSendData({
      couponId: coupon ? coupon._id : (coupons[0]?._id || ''),
      recipientEmails: '',
      sendToAllUsers: false,
      customMessage: 'Enjoy this exclusive promotional discount voucher from Voskiveriga Water Tech!',
    });
    setIsSendModalOpen(true);
  };

  const handleSendEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendData.couponId) {
      setAlertMessage({ type: 'error', text: 'Please select a coupon to send.' });
      return;
    }
    if (!sendData.sendToAllUsers && !sendData.recipientEmails.trim()) {
      setAlertMessage({ type: 'error', text: 'Please specify recipient email addresses or select Send to All.' });
      return;
    }

    setIsSending(true);
    setAlertMessage(null);

    try {
      const recipientEmails = sendData.recipientEmails
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);

      const res = await fetch('/api/v1/coupons/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponId: sendData.couponId,
          recipientEmails,
          sendToAllUsers: sendData.sendToAllUsers,
          customMessage: sendData.customMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAlertMessage({ type: 'success', text: data.message });
        setIsSendModalOpen(false);
        fetchCoupons();
      } else {
        setAlertMessage({ type: 'error', text: data.message || 'Email send failed' });
      }
    } catch (err: any) {
      setAlertMessage({ type: 'error', text: err.message || 'Send error' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>COMMERCE PROMOTIONS MANAGER</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Coupons & Offer Vouchers</h1>
          <p className="text-slate-300 text-sm mt-1">
            Create discount vouchers, configure redemption rules, and dispatch promotional emails directly to customers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenSendModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-emerald-500/20 transition duration-200 text-sm"
          >
            <Send className="w-4 h-4" />
            <span>Send Coupon Email</span>
          </button>

          <button
            onClick={() => handleOpenCreate()}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-blue-500/20 transition duration-200 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Coupon</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {alertMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between border text-sm font-medium shadow-sm transition-all ${
            alertMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {alertMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <span>{alertMessage.text}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Coupons</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalCoupons}</h3>
            <p className="text-xs text-slate-400 mt-1">Created in database</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Deals</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.activeCoupons}</h3>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Ready for checkout</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expired / Inactive</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats.expiredCoupons}</h3>
            <p className="text-xs text-slate-400 mt-1">Passed validity date</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Redemptions</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-1">{stats.totalRedemptions}</h3>
            <p className="text-xs text-indigo-600 mt-1 font-medium">Used by customers</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-600">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Coupons</option>
              <option value="active">Active Only</option>
              <option value="expired">Expired Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <button
            onClick={fetchCoupons}
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Coupon Cards Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading coupon vouchers...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No coupons found</h3>
          <p className="text-slate-500 text-sm mb-6">Create your first coupon voucher or adjust your search filter.</p>
          <button
            onClick={() => handleOpenCreate()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Coupon</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => {
            const isExpired = new Date(coupon.validUntil) < new Date();
            const discountLabel =
              coupon.discountType === 'percentage'
                ? `${coupon.discountValue}% OFF`
                : `₹${coupon.discountValue.toLocaleString('en-IN')} OFF`;

            return (
              <div
                key={coupon._id}
                className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg flex flex-col justify-between overflow-hidden ${
                  !coupon.isActive || isExpired
                    ? 'border-slate-200 opacity-85 bg-slate-50/50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Header Strip */}
                <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-xl tracking-wider text-sky-400">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                      title="Copy Coupon Code"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      !coupon.isActive
                        ? 'bg-slate-700 text-slate-300'
                        : isExpired
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {!coupon.isActive ? 'Inactive' : isExpired ? 'Expired' : 'Active'}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4 flex-1">
                  <div>
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-extrabold text-sm rounded-lg mb-2">
                      {discountLabel}
                      {coupon.discountType === 'percentage' && coupon.maxDiscount
                        ? ` (Up to ₹${coupon.maxDiscount})`
                        : ''}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{coupon.description}</p>
                  </div>

                  {/* Conditions List */}
                  <div className="space-y-2 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between">
                      <span>Min Order Value:</span>
                      <span className="font-semibold text-slate-700">
                        {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount.toLocaleString('en-IN')}` : 'No Min'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Valid Until:</span>
                      <span className={`font-semibold ${isExpired ? 'text-rose-600' : 'text-slate-700'}`}>
                        {new Date(coupon.validUntil).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Audience:</span>
                      <span className="font-semibold text-slate-700">
                        {coupon.targetedUsers && coupon.targetedUsers.length > 0
                          ? `Targeted (${coupon.targetedUsers.length} users)`
                          : 'Public (All Users)'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex justify-between mb-1 text-slate-600">
                        <span>Redemptions:</span>
                        <span className="font-bold text-slate-800">
                          {coupon.timesUsed || 0} / {coupon.usageLimit || '∞'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              ((coupon.timesUsed || 0) / (coupon.usageLimit || 1)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Status toggle */}
                    <button
                      onClick={() => handleToggleActive(coupon)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition ${
                        coupon.isActive
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {coupon.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      onClick={() => handleOpenSendModal(coupon)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Send via Email"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenCreate(coupon)}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition"
                      title="Edit Coupon"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingCoupon ? 'Edit Coupon Voucher' : 'Create New Coupon Voucher'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure discount code parameters</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER2026"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Get 20% off on water purifiers & softeners"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 20"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Max Ceiling (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Cap for %"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Valid From
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Global Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="500"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Per-User Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.perUserLimit}
                    onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target User Emails (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for public access, or add specific emails"
                  value={formData.targetedUsers}
                  onChange={(e) => setFormData({ ...formData, targetedUsers: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  If empty, any customer can use this coupon. If emails are specified, only those accounts will be eligible.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Set Active immediately</span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow transition flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingCoupon ? 'Update Coupon' : 'Create Coupon'}</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEND COUPON EMAIL MODAL */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Send Coupon via Email</h3>
                  <p className="text-xs text-slate-500">Dispatch promotional email vouchers to customers</p>
                </div>
              </div>
              <button
                onClick={() => setIsSendModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmailSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Select Coupon Code *
                </label>
                <select
                  required
                  value={sendData.couponId}
                  onChange={(e) => setSendData({ ...sendData, couponId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-slate-800"
                >
                  <option value="">-- Choose a Coupon --</option>
                  {coupons.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.code} ({c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}) - {c.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={sendData.sendToAllUsers}
                    onChange={(e) => setSendData({ ...sendData, sendToAllUsers: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Send to All Registered Users in Database</span>
                </label>

                {!sendData.sendToAllUsers && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Recipient Email Addresses
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. john@example.com, sara@example.com"
                      value={sendData.recipientEmails}
                      onChange={(e) => setSendData({ ...sendData, recipientEmails: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                    {registeredUsers.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[11px] font-semibold text-slate-500 mb-1">Quick Select Registered Users:</p>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {registeredUsers.map((u) => (
                            <button
                              key={u._id}
                              type="button"
                              onClick={() => {
                                const current = sendData.recipientEmails ? sendData.recipientEmails.split(',').map(e => e.trim()) : [];
                                if (!current.includes(u.email)) {
                                  setSendData({ ...sendData, recipientEmails: [...current, u.email].join(', ') });
                                }
                              }}
                              className="text-[10px] bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 px-2 py-0.5 rounded-md transition"
                            >
                              + {u.email}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Custom Administrator Note / Message
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional custom message included in email..."
                  value={sendData.customMessage}
                  onChange={(e) => setSendData({ ...sendData, customMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl shadow transition flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Emails...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Dispatch Emails</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
