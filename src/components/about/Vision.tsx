import React from 'react'

const Vision = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-sm border border-blue-100">
      <div className="flex items-center mb-4">
        <div className="bg-blue-600 p-3 rounded-lg mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Our Vision</h3>
      </div>
      <p className="text-gray-700 leading-relaxed">
        To become a trusted brand in water management and smart living solutions, 
        known for transparency, reliability, and real-world performance.
      </p>
    </div>
  )
}

export default Vision