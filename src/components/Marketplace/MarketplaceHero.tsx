// src/components/Marketplace/MarketplaceHero.tsx
import { useState } from "react";
import { motion } from "framer-motion";

const MarketplaceHero = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", search);
  };

  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-emerald-600 text-white py-16 relative overflow-hidden">
      {/* Decorative animated circles */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-white/10 rounded-full animate-pulseSlow"></div>
      <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-white/5 rounded-full animate-pulseSlow"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Agri Marketplace
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-white/90 mb-8"
          >
            Find fresh crops directly from trusted farmers
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for crops, location..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-500
                bg-white focus:outline-none focus:ring-2 focus:ring-white/70 transition"
            />

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-white text-green-700 font-semibold
                hover:bg-green-50 active:scale-[0.98] transition-transform duration-150"
            >
              Search
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default MarketplaceHero;