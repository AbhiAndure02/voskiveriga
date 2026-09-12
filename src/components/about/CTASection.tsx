import Link from "next/link";
import { ArrowRight, Zap } from 'lucide-react';

const CTASection = () => {
  const badges = [
    { value: "Made for India", label: "Local Expertise" },
    { value: "2-Year", label: "Product Warranty" },
    { value: "Free", label: "Installation Support" },
    { value: "30-Day", label: "Return Policy" }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>
      
      {/* Animated Orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Ready to Transform Your Space?</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Experience the Difference with
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Voskiveriga</span>
        </h2>
        
        <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
          Join thousands of satisfied customers who have chosen smart, practical solutions 
          for their homes and businesses. Let's build something great together.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/contact"
            className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Get Expert Consultation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-lg font-semibold hover:bg-white/20 hover:border-white/30 transition-all flex items-center justify-center gap-2"
          >
            Browse Products
            <span className="group-hover:rotate-90 transition-transform">↗</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10">
          {badges.map((badge, idx) => (
            <div key={idx} className="text-center group">
              <div className="text-2xl font-bold group-hover:scale-110 transition-transform">
                {badge.value}
              </div>
              <div className="text-gray-400 text-sm mt-1">{badge.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
