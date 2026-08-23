import React from 'react'

const WhyChooseUs = () => {
  const features = [
    "Focused product category (no misleading claims)",
    "Practical, engineering-driven solutions",
    "Quality-tested products",
    "Clear documentation and support",
    "Built for Indian households and usage conditions"
  ]

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">
        Why Choose Voskiveriga
      </h2>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <span className="text-indigo-600 font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-700 font-medium">{feature}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 p-6 bg-indigo-50 rounded-lg">
        <p className="text-gray-800 italic text-center">
          "Trusted solutions for smarter water management and home automation"
        </p>
      </div>
    </div>
  )
}

export default WhyChooseUs