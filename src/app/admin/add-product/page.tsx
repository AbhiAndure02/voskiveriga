// app/admin/add-product/page.tsx
'use client';

import { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Package,
  Star,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Plus,
  X,
  Loader2,
  ArrowLeft,
  Save,
  FileText,
  Hash,
  ShoppingBag,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';

interface ProductFormData {
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
}

interface FormErrors {
  [key: string]: string;
}

const categories = [
  'Electronics',
  'IoT Devices',
  'Smart Home',
  'Automation',
  'Security',
  'Energy',
  'Other'
];

export default function AddProduct() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    category: 'Electronics',
    stock: 0,
    images: [],
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    indexable: true,
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'seo'>('basic');

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Auto-generate slug from name
    if (field === 'name') {
      const slug = generateSlug(value);
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }

    // Auto-generate meta title from name
    if (field === 'name' && !formData.metaTitle) {
      setFormData(prev => ({
        ...prev,
        metaTitle: value
      }));
    }

    // Auto-generate meta description from description
    if (field === 'description' && !formData.metaDescription) {
      const truncatedDesc = value.length > 160 ? value.substring(0, 157) + '...' : value;
      setFormData(prev => ({
        ...prev,
        metaDescription: truncatedDesc
      }));
    }
  };

  const handleImageUpload = (url: string) => {
    setUploadingImage(true);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
    setUploadingImage(false);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.metaKeywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/v1/products/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ _form: data.message || 'Failed to add product' });
        }
        return;
      }

      setSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          slug: '',
          description: '',
          price: 0,
          category: 'Electronics',
          stock: 0,
          images: [],
          isFeatured: false,
          metaTitle: '',
          metaDescription: '',
          metaKeywords: [],
          indexable: true,
        });
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error adding product:', error);
      setErrors({ _form: 'Failed to add product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/admin/get-products"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium">Back to Products</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
                <p className="text-gray-600">Create a new product listing for your store</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('basic')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'basic'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      Basic Details
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('media')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'media'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Media
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('seo')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${activeTab === 'seo'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Globe className="w-4 h-4" />
                      SEO
                    </div>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Basic Details Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Tag className="w-4 h-4 text-gray-500" />
                            Product Name *
                          </div>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`w-full px-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Enter product name"
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Hash className="w-4 h-4 text-gray-500" />
                            Product Slug *
                          </div>
                          <span className="text-xs text-gray-500 font-normal">Auto-generated from name</span>
                        </label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value)}
                          className={`w-full px-4 py-3 bg-gray-50 border ${errors.slug ? 'border-red-500' : 'border-gray-300'
                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono`}
                          placeholder="product-slug"
                        />
                        {errors.slug && (
                          <p className="mt-2 text-sm text-red-600">{errors.slug}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.description ? 'border-red-500' : 'border-gray-300'
                          } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter product description"
                      />
                      {errors.description && (
                        <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            Price (₹) *
                          </div>
                        </label>
                        <input
                          type="number"
                          value={formData.price || ''}
                          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                          className={`w-full px-4 py-3 bg-gray-50 border ${errors.price ? 'border-red-500' : 'border-gray-300'
                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        {errors.price && (
                          <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          Category *
                        </label>
                        <div className="relative">
                          <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className={`w-full px-4 py-3 bg-gray-50 border ${errors.category ? 'border-red-500' : 'border-gray-300'
                              } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {errors.category && (
                          <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="w-4 h-4 text-gray-500" />
                            Stock *
                          </div>
                        </label>
                        <input
                          type="number"
                          value={formData.stock || ''}
                          onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                          className={`w-full px-4 py-3 bg-gray-50 border ${errors.stock ? 'border-red-500' : 'border-gray-300'
                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="0"
                          min="0"
                        />
                        {errors.stock && (
                          <p className="mt-2 text-sm text-red-600">{errors.stock}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.isFeatured ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                            {formData.isFeatured && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium text-gray-900">Mark as Featured</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="indexable"
                            checked={formData.indexable}
                            onChange={(e) => handleInputChange('indexable', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.indexable ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'}`}>
                            {formData.indexable && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {formData.indexable ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm font-medium text-gray-900">Search Indexable</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-4">
                        Product Images *
                        <span className="block text-sm font-normal text-gray-500 mt-1">
                          Upload at least one high-quality product image
                        </span>
                      </label>

                      {/* Image Uploader */}
                      <div className="mb-6">
                        <ImageUploader
                          onUploadComplete={handleImageUpload}
                          folder="products"
                        />
                        {uploadingImage && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                            <Loader2 className="animate-spin w-4 h-4" />
                            Uploading image...
                          </div>
                        )}
                      </div>

                      {/* Uploaded Images Preview */}
                      {formData.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                                <img
                                  src={image}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-xs text-white">Image {index + 1}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium mb-1">No images uploaded</p>
                          <p className="text-sm text-gray-500">
                            Upload images to preview them here
                          </p>
                        </div>
                      )}

                      {errors.images && (
                        <p className="mt-3 text-sm text-red-600">{errors.images}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Meta Title
                        <span className="block text-sm font-normal text-gray-500 mt-1">
                          Recommended: 50-60 characters
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="SEO title for search engines"
                      />
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          Auto-generated from product name
                        </p>
                        <p className={`text-xs font-medium ${formData.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                          {formData.metaTitle.length}/60
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Meta Description
                        <span className="block text-sm font-normal text-gray-500 mt-1">
                          Recommended: 150-160 characters
                        </span>
                      </label>
                      <textarea
                        value={formData.metaDescription}
                        onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="SEO description for search engines"
                      />
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          Auto-generated from description
                        </p>
                        <p className={`text-xs font-medium ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                          {formData.metaDescription.length}/160
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Meta Keywords
                        <span className="block text-sm font-normal text-gray-500 mt-1">
                          Add relevant keywords for better search visibility
                        </span>
                      </label>
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add keyword and press Enter"
                        />
                        <button
                          type="button"
                          onClick={addKeyword}
                          className="px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      {formData.metaKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {formData.metaKeywords.map((keyword, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg"
                            >
                              <span className="text-sm">{keyword}</span>
                              <button
                                type="button"
                                onClick={() => removeKeyword(index)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No keywords added yet
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errors._form && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2 text-red-700">
                      <XCircle className="w-5 h-5" />
                      <span className="font-medium">{errors._form}</span>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Product added successfully!</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-8 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        <span className="font-medium">Adding Product...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span className="font-medium">Add Product</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1 space-y-8">
            {/* Product Preview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Eye className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              </div>

              <div className="space-y-5">
                {formData.images.length > 0 ? (
                  <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={formData.images[0]}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">
                    {formData.name || 'Product Name'}
                  </h4>
                  <p className="text-2xl font-bold text-gray-900 mb-3">
                    {formData.price ? `₹${formData.price.toLocaleString()}` : '₹0'}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {formData.description || 'Product description will appear here'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    {formData.category || 'Category'}
                  </span>

                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${formData.stock > 10 ? 'bg-green-100 text-green-700' :
                    formData.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                    {formData.stock || 0} in stock
                  </span>

                  {formData.isFeatured && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* SEO Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">SEO Preview</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Google Search Result:</p>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-blue-600 font-medium line-clamp-1">
                      {formData.metaTitle || formData.name || 'Product Title'}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {formData.metaDescription || formData.description || 'Product description...'}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      techinfosync.com/products/{formData.slug || 'product-slug'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className={`w-5 h-5 ${formData.indexable ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="text-sm text-gray-700">
                    {formData.indexable ? 'Indexable by search engines' : 'Blocked from search engines'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Images Uploaded:</span>
                  <span className="font-medium text-gray-900">
                    {formData.images.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Keywords Added:</span>
                  <span className="font-medium text-gray-900">
                    {formData.metaKeywords.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Inventory Value:</span>
                  <span className="font-medium text-gray-900">
                    ₹{(formData.price * formData.stock).toLocaleString()}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Last updated: Just now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}