'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  Tag,
  AlertCircle,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [address, setAddress] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('voskiveriga_cart') || '[]');
      if (storedCart.length === 0) {
        router.push('/cart');
      } else {
        setCart(storedCart);
      }
    } catch (e) {
      console.error(e);
    }

    // Dynamically load Razorpay SDK checkout script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = subtotal >= 5000 ? 0 : 100;
  const grandTotal = Math.max(0, subtotal + shippingFee - discount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponCode.trim()) return;

    try {
      const res = await fetch('/api/v1/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          subtotal,
          userEmail: address.email,
        }),
      });

      const data = await res.json();
      if (data.success && data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountAmount: data.discountAmount,
          message: data.message,
        });
      } else {
        setCouponError(data.message || 'Invalid coupon');
      }
    } catch (err: any) {
      setCouponError('Failed to validate coupon');
    }
  };

  const handleCreateOrderAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.email || !address.phone || !address.addressLine1 || !address.postalCode) {
      alert('Please fill in all required shipping address fields.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on server side
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: address.name,
          customerEmail: address.email,
          customerPhone: address.phone,
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
          shippingAddress: {
            name: address.name,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          },
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        alert(orderData.message || 'Failed to create order');
        setLoading(false);
        return;
      }

      const order = orderData.data;

      // 2. Initiate Razorpay Order Parameters
      const rzpRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order._id }),
      });

      const rzpData = await rzpRes.json();
      if (!rzpData.success) {
        alert(rzpData.message || 'Failed to initialize payment gateway');
        setLoading(false);
        return;
      }

      const paymentInfo = rzpData.data;

      // 3. Launch Razorpay Checkout Modal
      const options = {
        key: paymentInfo.keyId,
        amount: paymentInfo.amount,
        currency: paymentInfo.currency,
        name: 'Voskiveriga Water Tech',
        description: `Order #${paymentInfo.orderNumber}`,
        order_id: paymentInfo.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Verify payment signature
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: paymentInfo.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              localStorage.removeItem('voskiveriga_cart');
              window.dispatchEvent(new Event('cart_updated'));
              router.push(`/orders/${paymentInfo.orderId}`);
            } else {
              alert('Payment signature verification failed: ' + verifyData.message);
            }
          } catch (err: any) {
            alert('Verification error: ' + err.message);
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted Secure Checkout
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Complete Your Industrial Order</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Guaranteed Secure Payment</span>
          </div>
        </div>

        <form onSubmit={handleCreateOrderAndPay} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Shipping Address & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                Shipping & Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@company.com"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="10-digit mobile number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit Pincode"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-slate-400 font-semibold mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  placeholder="House/Plot No., Building Name, Street"
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                Payment Gateway Integration
              </h3>
              <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white">
                    RZP
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Razorpay Secure Online Payment</h4>
                    <p className="text-slate-400">Supports UPI, Net Banking, Credit/Debit Cards, & Wallets</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl sticky top-6">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Order Summary</h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-950" />
                    <div className="flex-1">
                      <h4 className="font-bold text-white line-clamp-1">{item.name}</h4>
                      <p className="text-slate-400">Qty: {item.quantity} &times; ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <span className="font-bold text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" /> Apply Promo Code
                </label>
                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-300 font-bold">
                    <span>✓ {appliedCoupon.code} (-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')})</span>
                    <button type="button" onClick={() => setAppliedCoupon(null)} className="text-slate-400 hover:text-white">Remove</button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. VOSK10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded-xl text-xs transition"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
                  </div>
                )}
              </div>

              {/* Breakdown Table */}
              <div className="space-y-2 text-xs border-t border-slate-800 pt-4">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Express Shipping</span>
                  <span className="font-semibold text-white">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white border-t border-slate-800 pt-3">
                  <span>Grand Total</span>
                  <span className="text-cyan-400">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl text-sm shadow-xl shadow-cyan-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing Order...' : `Pay ₹${grandTotal.toLocaleString('en-IN')} via Razorpay`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
