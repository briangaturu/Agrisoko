import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-green-50 via-white to-green-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <span className="inline-block mb-4 px-4 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full shadow-sm">
            🌱 Digital Agriculture Marketplace
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Connect Farmers & Buyers
            <span className="text-green-600"> Without Middlemen</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Buy and sell fresh farm produce directly from verified farmers.
            Chat in real time, access seasonal crop insights, and trade with
            confidence — all in one smart platform.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/marketplace"
              className="px-8 py-3 rounded-md bg-green-600 text-white text-base font-semibold hover:bg-green-700 transition text-center shadow-md"
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

          {/* Stats */}
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

        {/* Right Image (No Frame / No Background) */}
        <div className="relative flex justify-center">

          {/* Soft Glow */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-green-200 blur-3xl opacity-60"></div>
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-green-300 blur-3xl opacity-60"></div>

          {/* Image Only */}
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e"
            alt="Fresh farm produce"
            className="relative w-full max-w-lg object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-500"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;