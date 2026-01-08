import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div>
          <span className="inline-block mb-4 px-4 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
            🌱 Digital Agriculture Marketplace
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Connect Farmers & Buyers  
            <span className="text-green-600"> Without Middlemen</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Buy and sell fresh farm produce directly from verified farmers.
            Chat in real time, access seasonal crop insights, and trade with
            confidence — all in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/marketplace"
              className="px-8 py-3 rounded-md bg-green-600 text-white text-base font-semibold hover:bg-green-700 transition text-center"
            >
              Explore Marketplace
            </Link>

            <Link
              to="/register"
              className="px-8 py-3 rounded-md border border-green-600 text-green-700 text-base font-semibold hover:bg-green-50 transition text-center"
            >
              Join as Farmer
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex gap-8 text-sm text-gray-500">
            <div>
              <span className="block text-xl font-bold text-gray-900">100+</span>
              Farmers
            </div>
            <div>
              <span className="block text-xl font-bold text-gray-900">50+</span>
              Crop Types
            </div>
            <div>
              <span className="block text-xl font-bold text-gray-900">24/7</span>
              Real-time Chat
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-green-100 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-200 rounded-full blur-2xl"></div>

          <div className="relative bg-white rounded-2xl shadow-xl p-6">
            <img
              src="/images/farm-marketplace.png"
              alt="Farm produce marketplace"
              className="rounded-xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
