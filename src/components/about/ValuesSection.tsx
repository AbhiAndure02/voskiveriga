import { Target, Shield, Users, TrendingUp } from 'lucide-react';

const values = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Honesty First",
    description: "No misleading claims, just transparent product information"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Quality Tested",
    description: "Every product undergoes rigorous testing for Indian conditions"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Customer Focus",
    description: "Built specifically for Indian households and needs"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Sustainable Solutions",
    description: "Products that save energy and reduce maintenance costs"
  }
];

const ValuesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Our Foundation</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Core Values That Drive Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Every decision we make and every product we build is guided by these principles
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-gray-200 p-8 hover:border-emerald-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl w-fit group-hover:scale-110 transition-transform duration-500">
                <div className="text-blue-600">
                  {value.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-600 transition-colors">
                {value.title}
              </h3>
              <p className="text-gray-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;