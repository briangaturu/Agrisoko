// src/components/Marketplace/MarketplaceHero.tsx
import { useState } from "react";

const MarketplaceHero = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement search logic
    console.log("Searching for:", search);
  };

  return (
    <div className="bg-linear-to-r from-green-600 to-emerald-600 text-white py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Agri Marketplace
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Find fresh crops directly from trusted farmers
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for crops, location..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-500
              bg-white focus:outline-none focus:ring-2 focus:ring-white/70"
            />

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-white text-green-700 font-semibold
              hover:bg-green-50 active:scale-[0.98] transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarketplaceHero;
