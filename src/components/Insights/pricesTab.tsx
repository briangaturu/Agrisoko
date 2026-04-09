import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader2, RefreshCw, MapPin } from "lucide-react";
import { KENYAN_CROPS } from "./constants";

const API_BASE = "http://localhost:5000/api/external";

// ── Types ──────────────────────────────────────────────────────────────────────
interface PriceDisplay {
  name: string;
  emoji: string;
  price: number;
  unit: string;
  market: string;
  change: number;
  date: string;
  isLive: boolean;
}

// ── Emoji map ──────────────────────────────────────────────────────────────────
const CROP_EMOJI_MAP: Record<string, string> = {
  maize: "🌽", corn: "🌽", tomato: "🍅", tomatoes: "🍅",
  potato: "🥔", potatoes: "🥔", bean: "🫘", beans: "🫘",
  kale: "🥬", sukuma: "🥬", avocado: "🥑", banana: "🍌",
  bananas: "🍌", onion: "🧅", onions: "🧅", rice: "🌾",
  wheat: "🌾", mango: "🥭", cabbage: "🥦", carrot: "🥕",
};

const getEmoji = (name: string): string => {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(CROP_EMOJI_MAP)) {
    if (key.includes(k)) return v;
  }
  return "🌱";
};

// ── Component ──────────────────────────────────────────────────────────────────
interface Props {
  selectedCrop: string;
  onSelectCrop: (crop: string) => void;
}

const PricesTab = ({ selectedCrop, onSelectCrop }: Props) => {
  const [prices, setPrices]           = useState<PriceDisplay[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState("all");
  const [markets, setMarkets]         = useState<string[]>([]);

  const fetchPrices = async (market?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE}/prices`);
      if (market && market !== "all") url.searchParams.set("market", market);

      const res  = await fetch(url.toString());
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to fetch prices");

      const data: any[] = json.data || [];

      // Extract unique markets
      const uniqueMarkets = [...new Set(data.map((p) => p.market).filter(Boolean))] as string[];
      setMarkets(uniqueMarkets);

      const display: PriceDisplay[] = data.map((item) => ({
        name:   item.name || item.commodity,
        emoji:  getEmoji(item.name || item.commodity),
        price:  item.price,
        unit:   item.unit || "kg",
        market: item.market || "Nairobi",
        change: item.change ?? 0,
        date:   item.date,
        isLive: true,
      }));

      setPrices(display);
      setLastUpdated(
        new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })
      );
    } catch (err: any) {
      console.error("Prices error:", err.message);
      setError(err.message);

      // Fallback to static estimates
      setPrices(
        KENYAN_CROPS.map((c) => ({
          name:   c.name,
          emoji:  c.emoji,
          price:  c.price,
          unit:   c.unit,
          market: "Nairobi (est.)",
          change: c.change,
          date:   new Date().toISOString(),
          isLive: false,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleMarketChange = (market: string) => {
    setSelectedMarket(market);
    fetchPrices(market === "all" ? undefined : market);
  };

  const filteredPrices =
    selectedMarket === "all"
      ? prices
      : prices.filter((p) =>
          p.market.toLowerCase().includes(selectedMarket.toLowerCase())
        );

  const isLiveData = prices.some((p) => p.isLive);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Market Prices</h2>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            {isLiveData ? (
              <>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
                Live · Updated {lastUpdated}
              </>
            ) : (
              "Estimated prices · Live data unavailable"
            )}
          </p>
        </div>
        <button
          onClick={() => fetchPrices(selectedMarket === "all" ? undefined : selectedMarket)}
          disabled={loading}
          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Market filter */}
      {markets.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleMarketChange("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              selectedMarket === "all"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
            }`}
          >
            All Markets
          </button>
          {markets.slice(0, 5).map((m) => (
            <button
              key={m}
              onClick={() => handleMarketChange(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1 ${
                selectedMarket === m
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
              }`}
            >
              <MapPin size={10} /> {m}
            </button>
          ))}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-700">
          ⚠️ {error} — showing estimated prices
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-green-600" />
          <span className="ml-2 text-gray-500 text-sm">Fetching live prices...</span>
        </div>
      )}

      {/* Price grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(filteredPrices.length > 0 ? filteredPrices : prices).map((crop) => (
            <button
              key={crop.name}
              onClick={() => onSelectCrop(crop.name)}
              className={`bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition border-2 ${
                selectedCrop.toLowerCase() === crop.name.toLowerCase()
                  ? "border-green-500"
                  : "border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{crop.emoji}</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm capitalize">{crop.name}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={9} className="text-green-400" />
                    {crop.market}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  KES {Number(crop.price).toLocaleString()}
                </p>
                {crop.change !== 0 && (
                  <div className={`flex items-center gap-1 justify-end text-xs font-medium ${
                    crop.change >= 0 ? "text-green-600" : "text-red-500"
                  }`}>
                    {crop.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(crop.change)}%
                  </div>
                )}
                {crop.isLive && (
                  <p className="text-xs text-gray-300 mt-0.5">
                    {new Date(crop.date).toLocaleDateString("en-KE", {
                      month: "short",
                      day:   "numeric",
                    })}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && filteredPrices.length === 0 && prices.length > 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          No prices for <span className="font-medium">{selectedMarket}</span>.{" "}
          <button
            onClick={() => handleMarketChange("all")}
            className="text-green-600 underline"
          >
            Show all
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Source: UjuziKilimo · Prices in KES
      </p>
    </div>
  );
};

export default PricesTab;