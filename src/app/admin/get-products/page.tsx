// app/admin/get-products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Star,
  Package,
  TrendingUp,
  CheckCircle,
  XCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Grid,
  List,
  Hash,
  Calendar,
  Zap,
  ExternalLink,
  IndianRupee,
  Tag,
  Clock,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  indexable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function GetProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    featured: 0,
    totalValue: 0
  });
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not-featured'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, sortBy, sortOrder, featuredFilter, stockFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        order: sortOrder,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(search && { search }),
        ...(featuredFilter === 'featured' && { featured: 'true' }),
        ...(featuredFilter === 'not-featured' && { featured: 'false' }),
        ...(stockFilter === 'in-stock' && { inStock: 'true' }),
        ...(stockFilter === 'out-of-stock' && { inStock: 'false' }),
      });

      const response = await fetch(`/api/v1/products/fetch-product?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);

        // Calculate stats
        const totalValue = data.data.reduce((sum, product) => sum + (product.price * product.stock), 0);
        const outOfStock = data.data.filter(p => p.stock === 0).length;
        const featured = data.data.filter(p => p.isFeatured).length;

        setStats({
          totalProducts: data.pagination.total,
          outOfStock,
          featured,
          totalValue
        });
      } else {
        throw new Error('Failed to load products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle product actions with slug
  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/v1/products/delete-product/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh products
        fetchProducts();
        // Remove from selected products
        setSelectedProducts(prev => prev.filter(productSlug => productSlug !== slug));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedProducts.length || !confirm(`Delete ${selectedProducts.length} selected products?`)) return;

    try {
      const selectedSlugs = products
        .filter(product => selectedProducts.includes(product._id))
        .map(product => product.slug);

      const deletePromises = selectedSlugs.map(slug =>
        fetch(`/api/v1/products/delete-product/${slug}`, {
          method: 'DELETE',
        })
      );

      const results = await Promise.allSettled(deletePromises);

      const failedDeletes = results.filter(result =>
        result.status === 'rejected' || !result.value?.ok
      );

      if (failedDeletes.length > 0) {
        alert(`${failedDeletes.length} products failed to delete. Please try again.`);
      } else {
        alert(`${selectedSlugs.length} products deleted successfully!`);
      }

      // Refresh products
      fetchProducts();
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Failed to delete products');
    }
  };

  const handleToggleFeatured = async (slug: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/products/update-product/${slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });

      if (response.ok) {
        fetchProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error instanceof Error ? error.message : 'Failed to update product');
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Electronic': 'bg-blue-100 text-blue-700',
      'Smart Home': 'bg-green-100 text-green-700',
      'IoT Devices': 'bg-purple-100 text-purple-700',
      'Automation': 'bg-amber-100 text-amber-700',
      'Security': 'bg-red-100 text-red-700',
      'Energy': 'bg-emerald-100 text-emerald-700',
      'Other': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.Other;
  };

  // Get stock status
  const getStockStatus = (stock: number) => {
    if (stock > 10) return { color: 'text-green-600', text: 'In Stock' };
    if (stock > 0) return { color: 'text-amber-600', text: 'Low Stock' };
    return { color: 'text-red-600', text: 'Out of Stock' };
  };

  // Copy product URL to clipboard
  const copyProductUrl = (slug: string) => {
    const url = `${window.location.origin}/products/${slug}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Product URL copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy URL');
      });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product inventory and listings</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/add-product"
            className="flex items-center gap-2 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            <span className="font-medium">Add New Product</span>
          </Link>

          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all duration-300"
            title="Refresh"
          >
            <Download size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Featured Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.featured}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Star className="text-amber-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-3xl font-bold text-gray-900">{stats.outOfStock}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <Package className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Inventory Value</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <IndianRupee className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                title="Grid View"
              >
                <Grid size={20} className={viewMode === 'grid' ? 'text-gray-900' : 'text-gray-600'} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                title="List View"
              >
                <List size={20} className={viewMode === 'list' ? 'text-gray-900' : 'text-gray-600'} />
              </button>
            </div>

            {/* Featured Filter */}
            <div className="relative">
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value as any)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="all">All Products</option>
                <option value="featured">Featured Only</option>
                <option value="not-featured">Not Featured</option>
              </select>
              <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Stock Filter */}
            <div className="relative">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock Only</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
              <Package className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Electronic">Electronics</option>
                <option value="IoT Devices">IoT Devices</option>
                <option value="Smart Home">Smart Home</option>
                <option value="Automation">Automation</option>
                <option value="Security">Security</option>
                <option value="Energy">Energy</option>
                <option value="Other">Other</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split(':');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="createdAt:desc">Newest First</option>
                <option value="createdAt:asc">Oldest First</option>
                <option value="price:desc">Price: High to Low</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="stock:desc">Stock: High to Low</option>
                <option value="stock:asc">Stock: Low to High</option>
                <option value="name:asc">Name: A to Z</option>
                <option value="name:desc">Name: Z to A</option>
              </select>
              <TrendingUp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        {/* Selected Products Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-blue-600" size={20} />
                <span className="text-blue-700 font-medium">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProducts([])}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-gray-900 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {search ? 'Try adjusting your search or filters' : 'Get started by adding your first product'}
          </p>
          <Link
            href="/admin/add-product"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={product.images[0] || `https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isFeatured && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product._id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                          }
                        }}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleFeatured(product.slug, product.isFeatured)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={product.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <Star
                          size={18}
                          className={product.isFeatured ? 'fill-amber-400 text-amber-400' : 'text-gray-400'}
                        />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                          {product.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Hash size={14} className="text-gray-400" />
                          <span className={`font-medium ${getStockStatus(product.stock).color}`}>
                            {product.stock} {getStockStatus(product.stock).text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-gray-500">
                            {formatDate(product.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} className="text-gray-600" />
                        </Link>
                        <Link
                          href={`/admin/add-product?id=${product._id}`}
                          className="flex items-center justify-center gap-1 px-2 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} className="text-blue-600" />
                        </Link>
                        <button
                          onClick={() => copyProductUrl(product.slug)}
                          className="flex items-center justify-center gap-1 px-2 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                          title="Copy URL"
                        >
                          <ExternalLink size={16} className="text-purple-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.slug)}
                          className="flex items-center justify-center gap-1 px-2 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === products.length && products.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(products.map(p => p._id));
                            } else {
                              setSelectedProducts([]);
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts([...selectedProducts, product._id]);
                              } else {
                                setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={product.images[0] || `https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&h=100&fit=crop`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-gray-900">
                                  {product.name}
                                </h4>
                                {product.isFeatured && (
                                  <Star size={14} className="fill-amber-400 text-amber-400" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${getStockStatus(product.stock).color}`}>
                              {product.stock}
                            </span>
                            {product.stock <= 10 && product.stock > 0 && (
                              <TrendingUp size={14} className="text-amber-500" />
                            )}
                            {product.stock === 0 && (
                              <XCircle size={14} className="text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/view-product/${product.slug}`}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye size={16} className="text-gray-600" />
                            </Link>
                            <Link
                              href={`/admin/add-product?id=${product._id}`}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} className="text-blue-600" />
                            </Link>
                            <button
                              onClick={() => handleToggleFeatured(product.slug, product.isFeatured)}
                              className="p-2 hover:bg-amber-50 rounded-lg transition-colors"
                              title={product.isFeatured ? 'Remove Featured' : 'Mark as Featured'}
                            >
                              <Star
                                size={16}
                                className={product.isFeatured ? 'fill-amber-400 text-amber-400' : 'text-gray-400'}
                              />
                            </button>
                            <button
                              onClick={() => copyProductUrl(product.slug)}
                              className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Copy URL"
                            >
                              <ExternalLink size={16} className="text-purple-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.slug)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, stats.totalProducts)} of {stats.totalProducts} products
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium ${currentPage === pageNum ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 