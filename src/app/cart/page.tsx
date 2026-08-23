"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Truck, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Tag,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { checkPincodeServiceability } from "@/lib/shiprocket";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pincode, setPincode] = useState("");
  const [shippingDetails, setShippingDetails] = useState<any>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: string } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Customer Shipping Details Form
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    fetchAvailableCoupons();
  }, [customer.email]);

  const fetchAvailableCoupons = async () => {
    try {
      const url = customer.email
        ? `/api/v1/coupons/available?email=${encodeURIComponent(customer.email)}`
        : '/api/v1/coupons/available';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAvailableCoupons(data.data);
      }
    } catch (e) {
      console.error('Error loading available coupons:', e);
    }
  };

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("voskiveriga_cart") || "[]");
      if (stored.length > 0) {
        setCart(stored);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("voskiveriga_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("voskiveriga_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalSavings = cart.reduce((acc, item) => acc + (item.originalPrice - item.price) * item.quantity, 0);
  const shippingFee = shippingDetails?.min_shipping_rate || 0;
  
  // Discount calculation based on applied coupon
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - couponDiscount);

  // Apply Coupon via backend API
  const handleApplyCoupon = async (e?: React.FormEvent, directCode?: string) => {
    if (e) e.preventDefault();
    setCouponError(null);
    const targetCode = directCode || couponCode;
    const cleanCode = targetCode.trim().toUpperCase();

    if (!cleanCode) return;

    setIsValidatingCoupon(true);
    try {
      const res = await fetch('/api/v1/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: cleanCode,
          subtotal,
          userEmail: customer.email,
        }),
      });

      const data = await res.json();
      if (data.valid && data.success) {
        setAppliedCoupon({
          code: data.coupon.code,
          discount: data.discountAmount,
          type: data.message,
        });
        setCouponCode("");
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (err: any) {
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim()) return;
    setIsCheckingPincode(true);
    try {
      const res = await checkPincodeServiceability(pincode);
      setShippingDetails(res);
      setCustomer((prev) => ({ ...prev, pincode }));
    } catch (err) {
      setShippingDetails({ success: false, message: "Failed to check serviceability." });
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address || !customer.pincode) {
      alert("Please fill in your Shipping Name, Phone, Address, and Pincode.");
      return;
    }

    setIsProcessing(true);

    try {
      const createRes = await fetch("/api/v1/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: grandTotal,
          items: cart,
          customer,
          paymentMethod,
          appliedCoupon,
        }),
      });

      const orderData = await createRes.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Order creation failed.");
      }

      const verifyRes = await fetch("/api/v1/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.order.id,
          paymentMethod,
          customer,
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        setOrderSuccess(verifyData.order);
        localStorage.removeItem("voskiveriga_cart");
        window.dispatchEvent(new Event("cart_updated"));
      } else {
        alert(verifyData.message || "Payment verification failed.");
      }
    } catch (err: any) {
      alert(err.message || "Error processing order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-12 h-12 text-slate-950 fill-white" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-white">Order Confirmed!</h1>
            <p className="text-cyan-400 font-semibold mt-1">Thank you for choosing Voskiveriga Water Tech</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-left space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Order Number:</span>
              <strong className="text-white font-mono">{orderSuccess.orderId}</strong>
            </div>
            <div className="flex justify-between">
              <span>Shiprocket Tracking AWB:</span>
              <strong className="text-cyan-400 font-mono">{orderSuccess.shiprocketAwb}</strong>
            </div>
            <div className="flex justify-between">
              <span>Est. Delivery:</span>
              <strong className="text-emerald-400">{orderSuccess.estimatedDelivery}</strong>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <strong className="text-white">{orderSuccess.status}</strong>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            A confirmation SMS & WhatsApp tracking link from Shiprocket will be dispatched to your phone.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/track-order?orderId=${orderSuccess.orderId}`}
              className="flex-1 py-3.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg text-sm"
            >
              Track Order via Shiprocket →
            </Link>
            <Link
              href="/"
              className="flex-1 py-3.5 rounded-xl font-semibold bg-slate-800 text-slate-200 text-sm hover:bg-slate-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-cyan-400" />
            Shopping Cart & Checkout
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Free Shiprocket Express Delivery • 5-Year Guarantee • 100% Salt-Free Descaler
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto" />
            <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
            <p className="text-slate-400 text-xs">Explore our range of electromagnetic water descalers to protect your home.</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Cart Items & Shipping Address */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Cart Items */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center justify-between">
                  <span>Selected Products ({cart.length})</span>
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Saved ₹{totalSavings.toLocaleString('en-IN')}
                  </span>
                </h3>

                <div className="divide-y divide-slate-800">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-2xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                        <div className="text-xs text-slate-400 mt-0.5">Salt-Free Electromagnetic Scale Control</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-base font-extrabold text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          <span className="text-xs text-slate-500 line-through">₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address Form */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Shipping & Delivery Address
                </h3>

                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="For invoice & Shiprocket tracking updates"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-400 block mb-1">House No. & Street Address *</label>
                    <input
                      type="text"
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="Flat, House No, Building, Apartment, Street Name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="City Name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Destination Pincode *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={customer.pincode}
                      onChange={(e) => setCustomer({ ...customer, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder="6-digit Pincode"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </form>
              </div>

            </div>

            {/* Right Column: Coupon, Shiprocket & Payment */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Coupon Code Section */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  Promo / Coupon Code
                </h4>

                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Check className="w-4 h-4" />
                      <span>{appliedCoupon.code} applied! (-₹{appliedCoupon.discount.toLocaleString('en-IN')})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="p-1 text-slate-400 hover:text-rose-400 transition"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <form onSubmit={(e) => handleApplyCoupon(e)} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter promo or voucher code..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase tracking-wider placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          type="submit"
                          disabled={isValidatingCoupon}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
                        >
                          {isValidatingCoupon ? "Validating..." : "Apply"}
                        </button>
                      </div>

                      {couponError && (
                        <div className="text-[11px] text-rose-400 flex items-start gap-1 p-2 bg-rose-950/40 border border-rose-900/50 rounded-xl">
                          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>{couponError}</span>
                        </div>
                      )}
                    </form>

                    {availableCoupons.length > 0 && (
                      <div className="pt-2 border-t border-slate-800">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          Available Deals for You:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {availableCoupons.map((c) => (
                            <button
                              key={c.id || c.code}
                              type="button"
                              onClick={() => handleApplyCoupon(undefined, c.code)}
                              className="text-left px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-xs rounded-xl transition group"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-cyan-400 group-hover:underline">
                                  {c.code}
                                </span>
                                <span className="text-[10px] bg-cyan-500/10 text-cyan-300 font-semibold px-1.5 py-0.5 rounded">
                                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                {c.description}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shiprocket Pincode Calculator Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  Shiprocket Logistics Pincode Estimator
                </h4>

                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter Pincode (e.g. 560001)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={isCheckingPincode}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded-xl text-xs transition"
                  >
                    {isCheckingPincode ? "Checking..." : "Check"}
                  </button>
                </form>

                {shippingDetails && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                    {shippingDetails.serviceable ? (
                      <>
                        <div className="text-emerald-400 font-bold">✓ Shiprocket Express Courier Available</div>
                        <div className="text-slate-300">Delivery ETD: <strong>{shippingDetails.estimated_days}</strong></div>
                        <div className="text-cyan-400">Courier: Bluedart / Delhivery / DTDC</div>
                      </>
                    ) : (
                      <div className="text-rose-400">{shippingDetails.message || "Pincode not serviceable"}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Summary & Payment Method */}
              <div className="bg-slate-900/80 border border-cyan-500/30 rounded-3xl p-6 space-y-6 shadow-2xl relative">
                <h3 className="text-lg font-bold text-white">Order Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span>-₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-300">
                    <span>Shiprocket Express Freight</span>
                    <span className="font-semibold text-emerald-400">FREE</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>5-Year Replacement Warranty</span>
                    <span className="font-semibold text-cyan-400">INCLUDED</span>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                    <span className="font-bold text-white text-base">Grand Total</span>
                    <span className="text-3xl font-extrabold text-white">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Payment Options</label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("razorpay")}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                        paymentMethod === "razorpay"
                          ? "bg-cyan-500/10 border-cyan-400 text-cyan-300"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-cyan-400" />
                      Razorpay / UPI / Cards
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                        paymentMethod === "cod"
                          ? "bg-cyan-500/10 border-cyan-400 text-cyan-300"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Truck className="w-5 h-5 text-emerald-400" />
                      Cash On Delivery (COD)
                    </button>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl font-extrabold text-base bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    "Processing Payment & Order..."
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-cyan-200" />
                      Complete Order • ₹{grandTotal.toLocaleString('en-IN')}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>256-Bit SSL Encrypted Razorpay Checkout</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
