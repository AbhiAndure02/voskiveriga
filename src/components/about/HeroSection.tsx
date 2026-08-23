import Link from "next/link";
import { ArrowRight, Star, Target, Zap, Shield } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-white text-gray-900 py-24 md:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />

        {/* Decorative Lines */}
        <div className="absolute top-1/2 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
        <div className="absolute top-1/2 right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-gray-300/50 to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Badge */}


            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                About
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Voskiveriga
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                Pioneering practical technology solutions for modern Indian households and businesses.
                We simplify smart living through innovative water management and home automation products.
              </p>
            </div>

            {/* Key Points */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Innovative Solutions</h3>
                  <p className="text-gray-600 text-sm">Cutting-edge technology for modern living</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Reliable Performance</h3>
                  <p className="text-gray-600 text-sm">Built for durability and long-term use</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Customer First</h3>
                  <p className="text-gray-600 text-sm">Exceptional support and service</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/products"
                className="group relative px-6 py-3 bg-black text-white rounded-lg font-semibold flex items-center justify-center gap-2 overflow-hidden hover:bg-gray-800 transition-all duration-300"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                Contact Experts
              </Link>
            </div>
          </div>

          {/* Right Column - Stats & Visual */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">2+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">2K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">10+</div>
                <div className="text-sm text-gray-600">Cities Served</div>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-2xl" />
              <div className="relative p-8 bg-white border-2 border-gray-300 rounded-2xl transform translate-x-2 translate-y-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Smart Technology</h3>
                      <p className="text-gray-600 text-sm">Intelligent solutions for modern living</p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Quality Assurance</h3>
                      <p className="text-gray-600 text-sm">Rigorous testing and certification</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-8">
            {["Water Management", "Home Automation", "IoT Solutions", "Energy Efficiency"].map((service, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-900 rounded-full" />
                <span className="font-medium text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;