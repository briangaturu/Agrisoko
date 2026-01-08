// src/components/Insights/InsightsFilters.tsx
import { useState } from "react";

const InsightsFilters = () => {
  const [crop, setCrop] = useState("");
  const [region, setRegion] = useState("");
  const [season, setSeason] = useState("");

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Filters</h2>

      {/* Crop */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Crop</label>
        <input
          type="text"
          placeholder="e.g. Tomatoes"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Region */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Region</label>
        <input
          type="text"
          placeholder="e.g. Kiambu"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Season */}
      <div>
        <label className="block text-sm font-medium text-gray-600">Season</label>
        <input
          type="text"
          placeholder="e.g. Jan - Mar"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button className="w-full py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition">
        Apply Filters
      </button>
    </div>
  );
};

export default InsightsFilters;
