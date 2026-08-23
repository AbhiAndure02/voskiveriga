import { notFound } from "next/navigation";
import { ProductDTO } from "@/dto/ProductDTO";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string): Promise<ProductDTO> {
  if (!slug) notFound();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/v1/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const json = await res.json();

  if (!json.success || !json.data) {
    notFound();
  }

  return json.data as ProductDTO;
}

export default async function ViewProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <a href="/" className="hover:text-blue-600 transition-colors">
                Home
              </a>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <a href="/products" className="hover:text-blue-600 transition-colors">
                Products
              </a>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Product Images Section */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center p-4 border border-gray-200">
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain max-h-[500px]"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p>No image available</p>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg bg-gray-100 overflow-hidden border border-gray-200 cursor-pointer hover:border-blue-500 transition-all"
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              {/* Category Badge */}
              <div className="inline-block">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.price && (
                  <span className="text-2xl text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center">
                {product.stock > 0 ? (
                  <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-medium">
                      {product.stock} units in stock
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="font-medium">Out of stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Description
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Product Details Grid */}
              {/* <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">SKU</p>
                  <p className="font-medium text-gray-900">
                    {product.sku || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="font-medium text-gray-900">
                    {product.brand || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium text-gray-900">
                    {product.weight || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Dimensions</p>
                  <p className="font-medium text-gray-900">
                    {product.dimensions || "N/A"}
                  </p>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                {product.stock > 0 ? (
                  <>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl">
                      Add to Cart
                    </button>
                    <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300">
                      Buy Now
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-xl cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>

              {/* Additional Info */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-2">🔄</span>
                    <span>30-Day Return Policy</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🚚</span>
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🛡️</span>
                    <span>Warranty Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Info Section */}
          <div className="bg-gray-50 border-t border-gray-200 p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  📦 Shipping Info
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Free shipping on orders over ₹500</li>
                  <li>• Delivered in 3-5 business days</li>
                  <li>• Cash on delivery available</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  🔄 Returns
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 30-day return policy</li>
                  <li>• Free returns for defective items</li>
                  <li>• Refund processed in 5-7 days</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  📞 Need Help?
                </h3>
                <p className="text-gray-700">
                  Contact our customer support for any questions about this
                  product.
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}