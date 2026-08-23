import { Target, Zap, Globe, Award, Users } from 'lucide-react';

const StorySection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Our Origin</span>
            </div>
            
            <h2 className="text-4xl font-bold mb-6">Building Solutions for Real Indian Needs</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                Voskiveriga was born from a simple observation: Indian households and businesses needed 
                <span className="font-semibold text-blue-600"> practical, reliable technology solutions</span> 
                specifically designed for local conditions.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                We started with water descaling technology because hard water affects 80% of Indian households, 
                causing appliance damage and increased maintenance costs. Today, we've expanded to smart home 
                solutions, always maintaining our commitment to{" "}
                <span className="font-semibold text-emerald-600">transparency and real-world effectiveness</span>.
              </p>
            </div>

            <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Our Promise</h4>
                  <p className="text-gray-700">
                    No overpromising. Just engineering-driven products that solve actual problems 
                    faced by Indian homes and businesses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-emerald-500 p-1 rounded-2xl shadow-2xl">
              <div className="bg-white rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💧</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Water Technology Specialists</h4>
                      <p className="text-gray-600 text-sm">Expertise in hard water solutions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🏠</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Made for India</h4>
                      <p className="text-gray-600 text-sm">Products tested for Indian conditions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Globe className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Pan-India Reach</h4>
                      <p className="text-gray-600 text-sm">Serving customers across the country</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-100 rounded-2xl rotate-12 shadow-lg flex items-center justify-center">
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-pink-100 rounded-2xl -rotate-12 shadow-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;