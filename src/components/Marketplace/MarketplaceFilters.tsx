// src/components/Marketplace/MarketplaceFilters.tsx
import { useState } from "react";

const MarketplaceFilters = () => {
  const [cropType, setCropType] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Filters</h2>

      {/* Crop Type */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Crop Type</label>
        <input
          type="text"
          placeholder="e.g. Tomatoes"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Location</label>
        <input
          type="text"
          placeholder="e.g. Kiambu"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Max Price (KES)</label>
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
          className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button className="w-full py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition">
        Apply Filters
      </button>
    </div>
  );
};

export default MarketplaceFilters;
