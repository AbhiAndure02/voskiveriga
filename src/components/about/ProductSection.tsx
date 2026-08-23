import Link from "next/link";
import { ArrowRight, CheckCircle } from 'lucide-react';

const ProductsSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Specializations</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Focused expertise in two critical areas for modern living
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Water Descaler Card */}
          <div className="group bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <span className="text-2xl">💧</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Water Descaler Systems</h3>
                  <p className="text-blue-600 font-semibold">Chemical-free limescale prevention</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                Engineered specifically for Indian hard water conditions. Our systems use advanced 
                technology to alter mineral salt structures, preventing scale buildup without chemicals.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Reduces limescale by up to 99%",
                  "Extends appliance lifespan",
                  "Zero maintenance required",
                  'Available for all pipe sizes (1” - 2.5")'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/products/water-descalers"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold group/link"
              >
                Explore Water Solutions
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Smart Home Card */}
          <div className="group bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <span className="text-2xl">🏠</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Smart Home Products</h3>
                  <p className="text-emerald-600 font-semibold">Intelligent living made simple</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                Carefully curated smart devices that enhance comfort, security, and energy efficiency 
                for Indian homes. Easy to install, intuitive to use.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Smart controllers & automation",
                  "Energy monitoring systems",
                  "IoT-based utility management",
                  "Easy integration with existing setups"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/products/smart-home"
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold group/link"
              >
                Explore Smart Home Products
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;