// src/components/Marketplace/MarketplaceFilters.tsx
import { useState } from "react";

const MarketplaceFilters = () => {
  const [cropType, setCropType] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  return (
    <div className="w-full mb-8">
      
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Filters
      </h2>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 items-end">

        {/* Crop Type */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Crop Type
          </label>

          <input
            type="text"
            placeholder="e.g. Tomatoes"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            transition"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Location
          </label>

          <input
            type="text"
            placeholder="e.g. Kiambu"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            transition"
          />
        </div>

        {/* Price Range */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Max Price (KES)
          </label>

          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            transition"
          />
        </div>

        {/* Button */}
        <div className="w-full md:w-auto">
          <button
            className="w-full md:w-auto px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold
            hover:bg-green-700 active:scale-[0.98] transition"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
};

export default MarketplaceFilters;
