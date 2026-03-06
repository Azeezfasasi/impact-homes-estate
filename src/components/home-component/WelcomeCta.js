import React from 'react'

export default function WelcomeCta() {
  const stats = [
    { icon: '🚀', number: '1000+', label: 'Homes delivered' },
    { icon: '🚀', number: '1,000,500+', label: 'Square foot Developed' },
    { icon: '🚀', number: '50+', label: 'Experienced Professionals' },
    { icon: '🚀', number: '10+', label: 'Years of Progressive Excellence' },
  ]

  return (
    <div className="max-w-7xl bg-white mx-auto my-4 lg:rounded-lg shadow-lg overflow-hidden mt-0 md:mt-[0px] lg:mt-[0px] z-10 relative border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Section - Purple Background */}
        <div className="bg-gradient-to-br from-impact-gold to-impact-gold/90 flex flex-col justify-center items-start p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Enjoy Free Investment Advisory Services
            </h1>
            
            <p className="text-lg text-gray-100 mb-8 leading-relaxed">
              Would you like to get started with investments in real estate? Our trained and well experienced Investment Advisors are willing to guide you on your journey to a profitable real estate investment
            </p>
            
            <button className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl">
              Speak with an Investment Advisor
              <span className="text-xl">📋</span>
            </button>
          </div>
        </div>

        {/* Right Section - Stats Grid */}
        <div className="bg-white flex flex-col justify-center items-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  {/* Icon */}
                  <div className="text-6xl md:text-7xl mb-4 relative">
                    <div className="relative inline-block">
                      <span>{stat.icon}</span>
                      <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-sm font-bold">
                        ✓
                      </div>
                    </div>
                  </div>

                  {/* Number */}
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </h3>

                  {/* Label */}
                  <p className="text-base md:text-lg text-gray-700 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
