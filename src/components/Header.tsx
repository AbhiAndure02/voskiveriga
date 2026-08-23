'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  Search,
  Menu,
  X,
  Droplet,
  ShieldCheck,
  Truck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { checkPincodeServiceability } from '@/lib/shiprocket';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Descalers', href: '/products' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'About Tech', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPincodeOpen, setIsPincodeOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<any>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsPincodeOpen(false);

    // Update cart badge from localStorage
    const updateCartCount = () => {
      try {
        const cartData = JSON.parse(localStorage.getItem('voskiveriga_cart') || '[]');
        const count = cartData.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
        setCartCount(count);
      } catch (e) {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cart_updated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart_updated', updateCartCount);
    };
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput.trim()) return;
    setIsCheckingPincode(true);
    setPincodeResult(null);
    try {
      const result = await checkPincodeServiceability(pincodeInput);
      setPincodeResult(result);
    } catch (err) {
      setPincodeResult({
        success: false,
        message: 'Could not check pincode serviceability.',
      });
    } finally {
      setIsCheckingPincode(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20 text-slate-100 shadow-xl transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-800 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
        <span>Voskiveriga Breakthrough Hard Water Treatment: <strong>100% Salt-Free & 5-Year Guarantee</strong></span>
        <span className="hidden md:inline-block text-cyan-200">| Free Shiprocket Express Delivery Across India</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Droplet className="w-6 h-6 text-cyan-400 fill-cyan-400/20 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent font-sans">
                VOSKIVERIGA
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-cyan-400/90 -mt-1">
                Electromagnetic Descaler
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive(item.href)
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-semibold'
                    : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions Right */}
          <div className="flex items-center gap-3">
            {/* Pincode Shipping Modal Trigger */}
            <button
              onClick={() => setIsPincodeOpen(!isPincodeOpen)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition"
              title="Check Shiprocket Delivery Pincode"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{pincodeResult?.delivery_postcode ? `PIN: ${pincodeResult.delivery_postcode}` : 'Check Pincode'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50 transition group"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Buy Now Quick CTA */}
            <Link
              href="/cart"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all"
            >
              Buy Descaler
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-cyan-400"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Pincode Check Dropdown Modal */}
      {isPincodeOpen && (
        <div className="absolute right-4 sm:right-20 top-24 z-50 w-80 p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl text-slate-100">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-cyan-300">
              <Truck className="w-4 h-4 text-cyan-400" />
              Shiprocket Delivery Check
            </h4>
            <button onClick={() => setIsPincodeOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handlePincodeCheck} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode (e.g. 560001)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={isCheckingPincode}
                className="absolute right-1 top-1 bottom-1 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition"
              >
                {isCheckingPincode ? 'Checking...' : 'Verify'}
              </button>
            </div>
          </form>

          {pincodeResult && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
              {pincodeResult.serviceable ? (
                <>
                  <div className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Delivery Available!
                  </div>
                  <div className="text-slate-300">
                    Est. Delivery: <strong>{pincodeResult.estimated_days}</strong>
                  </div>
                  <div className="text-cyan-400 font-medium">
                    Shipping Charge: FREE Express (Shiprocket Partner)
                  </div>
                </>
              ) : (
                <div className="text-rose-400">{pincodeResult.message || 'Pincode not serviceable.'}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition ${isActive(item.href)
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-900'
                }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-900">
            <Link
              href="/cart"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
            >
              <ShoppingBag className="w-5 h-5" />
              Go to Cart & Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}