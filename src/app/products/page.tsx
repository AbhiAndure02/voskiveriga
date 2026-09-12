'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Star,
  ShoppingBag,
  Check,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface Product {
  id: string;
  _id?: string;
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

interface CartItem {
  id: string;
  slug?: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  quantity?: number;
}

function specValue(product: Product, key: string, fallback = 'Available on request') {
  if (key.toLowerCase().includes('warranty')) {
    return '2-Year Warranty';
  }

  return product.specifications?.find((spec) => spec.key.toLowerCase().includes(key))?.value || fallback;
}

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=100&sortBy=newest', { cache: 'no-store' });
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Failed to load products');
        }

        if (!cancelled) {
          setProducts(json.data?.products || []);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
        }
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

  const filteredProducts = products.filter((product) => {
    const searchableText = `${product.name} ${product.shortDescription || product.description}`.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = searchableText.includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('voskiveriga_cart') || '[]') as CartItem[];
      const existingIndex = existingCart.findIndex((item) => item.id === product.id);

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
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-cyan-400" />
              Live Product Catalog
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              Voskiveriga Product Catalog
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore active products directly from inventory. Stock, pricing, and product details refresh automatically.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
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

        {error && !isLoading && (
          <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-8 text-center text-rose-200">
            {error}
          </div>
        )}

        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center text-slate-300">
            No active products found.
          </div>
        )}

        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300 flex flex-col group hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={product.images?.[0] || '/images/logo.jpeg'}
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
                          <ShoppingBag className="w-4 h-4" /> Buy Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
