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
    <div className="bg-green-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Agri Marketplace
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Find fresh crops directly from trusted farmers
        </p>

        <form
          onSubmit={handleSearch}
          className="flex max-w-md mx-auto gap-2"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for crops, location..."
            className="flex-1 px-4 py-2 rounded-l-md text-gray-900 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-green-600 font-semibold px-4 rounded-r-md hover:bg-green-50 transition"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarketplaceHero;
