'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Check,
  Star,
  Zap,
  CheckCircle2,
  Truck,
} from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string | null;
  category: string;
  images: string[];
  price: number;
  mrp: number;
  stock: number;
  isFeatured: boolean;
  specifications?: { key: string; value: string }[];
}

function specValue(product: Product, key: string, fallback = 'Available on request') {
  return product.specifications?.find((spec) => spec.key.toLowerCase().includes(key))?.value || fallback;
}

export default function ProductShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=6&sortBy=newest', { cache: 'no-store' });
        const json = await res.json();

        if (!cancelled && res.ok && json.success) {
          setProducts(json.data?.products || []);
        }
      } catch (e) {
        console.error('Failed to load live products', e);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();
    const interval = window.setInterval(loadProducts, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))],
    [products]
  );

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('voskiveriga_cart') || '[]');
      const existingIndex = existingCart.findIndex((item: any) => item.id === product.id);

      if (existingIndex > -1) {
        existingCart[existingIndex].quantity = (existingCart[existingIndex].quantity || 1) + 1;
      } else {
        existingCart.push({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          originalPrice: product.mrp,
          image: product.images?.[0] || '',
          quantity: 1,
        });
      }

      localStorage.setItem('voskiveriga_cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event('cart_updated'));
      setAddedItem(product.id);
      setTimeout(() => setAddedItem(null), 2500);
    } catch (e) {
      console.error('Failed to update cart', e);
    }
  };

  return (
    <section className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-900 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Live Inventory Lineup
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              Voskiveriga Products
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
              Pricing and stock are loaded directly from the catalog and refresh automatically.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center text-slate-300">
            Loading live products...
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center text-slate-300">
            No active products found.
          </div>
        )}

        {!isLoading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300 flex flex-col group hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={product.images?.[0] || '/next.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isFeatured && (
                      <span className="px-3 py-1 rounded-full bg-yellow-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow-lg">
                        Featured
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold text-[10px] backdrop-blur-md">
                      {product.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-xs flex items-center gap-1 text-yellow-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {product.shortDescription || product.description}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Pipe: {specValue(product, 'pipe')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>TDS Support: {specValue(product, 'tds')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Warranty: {specValue(product, 'warranty')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      {product.mrp > product.price && (
                        <div className="text-xs text-slate-400 line-through">Rs. {product.mrp.toLocaleString('en-IN')}</div>
                      )}
                      <div className="text-2xl font-extrabold text-white">Rs. {product.price.toLocaleString('en-IN')}</div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                        product.stock <= 0
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : addedItem === product.id
                            ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                      }`}
                    >
                      {addedItem === product.id ? (
                        <>
                          <Check className="w-4 h-4" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Fast Nationwide Delivery via Shiprocket</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Orders dispatched within 24 hours with live tracking after shipment.
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shrink-0"
          >
            View Live Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
