const stats = [
  { number: "5000+", label: "Happy Customers" },
  { number: "95%", label: "Customer Satisfaction" },
  { number: "15+", label: "Cities Served" },
  { number: "24/7", label: "Support Available" }
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                {stat.number}
              </div>
              <div className="text-gray-600 mt-2 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;