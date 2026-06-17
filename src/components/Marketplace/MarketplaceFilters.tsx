// src/components/Marketplace/MarketplaceFilters.tsx
interface MarketplaceFiltersProps {
  cropType: string;
  location: string;
  maxPrice: string;
  onCropTypeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onReset: () => void;
}

const MarketplaceFilters = ({
  cropType,
  location,
  maxPrice,
  onCropTypeChange,
  onLocationChange,
  onMaxPriceChange,
  onReset,
}: MarketplaceFiltersProps) => {

  return (
    <div className="w-full mb-6">
      
      {/* Header */}
      <h2 className="text-lg md:text-xl font-bold text-green-700 mb-3">
        Filters
      </h2>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-3 items-end">

        {/* Crop Type */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-xs md:text-sm font-medium text-green-800 mb-1">
            Crop Type
          </label>
          <input
            type="text"
            placeholder="e.g. Tomatoes"
            value={cropType}
            onChange={(e) => onCropTypeChange(e.target.value)}
            className="px-3 py-2 border border-green-200 rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            transition"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-xs md:text-sm font-medium text-green-800 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="e.g. Kiambu"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="px-3 py-2 border border-green-200 rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            transition"
          />
        </div>

        {/* Price Range */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-xs md:text-sm font-medium text-green-800 mb-1">
            Max Price (KES)
          </label>
          <input
            type="number"
            min={0}
            placeholder="e.g. 200"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="px-3 py-2 border border-green-200 rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
            transition"
          />
        </div>

        {/* Reset Button */}
        <div className="w-full md:w-auto md:ml-auto">
          <button
            onClick={onReset}
            className="w-full md:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold
            hover:bg-gray-300 active:scale-[0.98] transition text-sm"
          >
            Reset Filters
          </button>
        </div>

      </div>
    </div>
  );
};

export default MarketplaceFilters;