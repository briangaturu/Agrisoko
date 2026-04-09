import { useState } from "react";
import { MapPin, Search, Loader2, ChevronDown } from "lucide-react";
import { useGetListingsQuery } from "../../features/api/listingsApi";
import {
  CROP_EMOJIS, MONTHS, SHORT_MONTHS,
  type Listing,
} from "./constants";

interface ProduceLocation {
  cropName: string;
  emoji: string;
  locations: {
    location: string;
    farmerName: string;
    phone: string;
    price: string;
    unit: string;
    quantity: number;
    listingId: string;
  }[];
}

const AvailabilityTab = () => {
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [searchCrop, setSearchCrop]       = useState("");
  const [expandedCrop, setExpandedCrop]   = useState<string | null>(null);

  const { data, isLoading } = useGetListingsQuery(undefined);
  const listings: Listing[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const produceByMonth: ProduceLocation[] = (() => {
    const filtered = listings.filter((l) => {
      const month = new Date(l.createdAt).getMonth();
      return month === selectedMonth && l.status === "ACTIVE";
    });
    const grouped: Record<string, ProduceLocation> = {};
    filtered.forEach((listing) => {
      const cropName = listing.crop?.name || "Unknown";
      if (!grouped[cropName]) {
        grouped[cropName] = {
          cropName,
          emoji: CROP_EMOJIS[cropName] || CROP_EMOJIS.default,
          locations: [],
        };
      }
      grouped[cropName].locations.push({
        location: listing.location,
        farmerName: listing.farmer?.fullName || "Unknown Farmer",
        phone: listing.farmer?.phone || "",
        price: listing.pricePerUnit,
        unit: listing.crop?.unit || "kg",
        quantity: listing.quantityAvailable,
        listingId: listing.id,
      });
    });
    return Object.values(grouped).filter((p) =>
      p.cropName.toLowerCase().includes(searchCrop.toLowerCase())
    );
  })();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Find Produce Near You</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Browse where to get fresh produce based on active farmer listings
        </p>
      </div>

      {/* Month selector */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Select Month</p>
        <div className="flex gap-2 flex-wrap">
          {SHORT_MONTHS.map((m, i) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                selectedMonth === i
                  ? "bg-green-600 text-white"
                  : i === currentMonth
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {m}
              {i === currentMonth && selectedMonth !== i && (
                <span className="ml-1 text-green-500">•</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search produce (e.g. Maize, Tomatoes...)"
          value={searchCrop}
          onChange={(e) => setSearchCrop(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-green-600" />
          <span className="ml-2 text-gray-500 text-sm">Loading listings...</span>
        </div>
      ) : produceByMonth.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <span className="text-5xl">🌾</span>
          <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
            No listings for {MONTHS[selectedMonth]}
          </h3>
          <p className="text-sm text-gray-400">
            {searchCrop
              ? `No "${searchCrop}" listings found this month.`
              : "No farmers have posted listings for this month yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-green-700">{produceByMonth.length}</span> produce
            type{produceByMonth.length !== 1 ? "s" : ""} available in{" "}
            <span className="font-semibold text-green-700">{MONTHS[selectedMonth]}</span>
          </p>

          {produceByMonth.map((produce) => (
            <div key={produce.cropName} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedCrop(expandedCrop === produce.cropName ? null : produce.cropName)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{produce.emoji}</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{produce.cropName}</p>
                    <p className="text-xs text-gray-400">
                      {produce.locations.length} farmer{produce.locations.length !== 1 ? "s" : ""} available
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {produce.locations.slice(0, 3).map((loc, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                        {loc.farmerName.charAt(0)}
                      </div>
                    ))}
                    {produce.locations.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-bold">
                        +{produce.locations.length - 3}
                      </div>
                    )}
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${
                    expandedCrop === produce.cropName ? "rotate-180" : ""
                  }`} />
                </div>
              </button>

              {expandedCrop === produce.cropName && (
                <div className="border-t divide-y">
                  {produce.locations.map((loc, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {loc.farmerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{loc.farmerName}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <MapPin size={11} className="text-green-500" />
                            <span className="capitalize">{loc.location}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{loc.quantity} {loc.unit} available</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-700 text-sm">KES {Number(loc.price).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">per {loc.unit}</p>
                        <a href={`tel:${loc.phone}`}
                          className="inline-block mt-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full hover:bg-green-100 transition">
                          📞 Call
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityTab;