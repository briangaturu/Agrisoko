import { useState, useEffect, useCallback } from "react";
import {
  Cloud, Sun, CloudRain, CloudSnow, CloudLightning,
  Loader2, RefreshCw, Search, Wind, Droplets, Thermometer,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api/external";

// ── Weather icon ───────────────────────────────────────────────────────────────
export const WeatherConditionIcon = ({ code, size = 24 }: { code: number; size?: number }) => {
  if (code === 1000) return <Sun size={size} className="text-amber-400" />;
  if (code >= 1273)  return <CloudLightning size={size} className="text-yellow-500" />;
  if (code >= 1210)  return <CloudSnow size={size} className="text-blue-200" />;
  if (code >= 1180)  return <CloudRain size={size} className="text-blue-400" />;
  return <Cloud size={size} className="text-gray-400" />;
};

// ── Farming advisory ───────────────────────────────────────────────────────────
const getFarmingAdvisory = (w: any): string => {
  const rain     = w.forecast?.forecastday?.[0]?.condition?.text?.toLowerCase() || "";
  const temp     = w.current?.temp_c;
  const humidity = w.current?.humidity;

  if (rain.includes("rain") || rain.includes("drizzle"))
    return "Rain expected today. Good time to transplant seedlings or apply organic manure. Avoid pesticide spraying as it will be washed off.";
  if (temp > 30)
    return "High temperatures today. Ensure crops are well-watered, preferably in the early morning or evening to reduce evaporation.";
  if (humidity > 80)
    return "High humidity detected. Watch out for fungal diseases like blight. Ensure good air circulation around plants.";
  if (temp < 15)
    return "Cool temperatures. Ideal for growing kale, cabbage, and spinach. Protect heat-sensitive crops overnight.";
  return "Good farming conditions today. Ideal for field operations, weeding, and applying fertilizers.";
};

// ── Component ──────────────────────────────────────────────────────────────────
const WeatherTab = () => {
  const [weather, setWeather]       = useState<any>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const fetchWeather = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(
        `${API_BASE}/weather?location=${encodeURIComponent(location)}&days=5`
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Weather fetch failed");
      setWeather(json.data || json);
    } catch (err: any) {
      setError(err.message || "Failed to load weather.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
        ()    => fetchWeather("Nairobi")
      );
    } else {
      fetchWeather("Nairobi");
    }
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = (e.target as HTMLInputElement).value.trim();
      if (val) fetchWeather(val);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Enter location (e.g. Nakuru, Kisumu...)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
          />
        </div>
        <button
          onClick={() => { if (searchInput) fetchWeather(searchInput); }}
          disabled={loading}
          className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-green-600" />
          <span className="ml-2 text-gray-500 text-sm">Fetching weather...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {weather && !loading && (
        <>
          {/* Current */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  {weather.location?.name}, {weather.location?.region}
                </p>
                <p className="text-5xl font-bold text-gray-900 mt-1">
                  {Math.round(weather.current?.temp_c)}°C
                </p>
                <p className="text-gray-500 mt-1">{weather.current?.condition?.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Feels like {Math.round(weather.current?.feelslike_c)}°C
                </p>
              </div>
              <img
                src={`https:${weather.current?.condition?.icon}`}
                alt={weather.current?.condition?.text}
                className="w-20 h-20"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Droplets size={18} className="text-blue-400 mx-auto mb-1" />
                <p className="text-sm font-semibold text-gray-800">{weather.current?.humidity}%</p>
                <p className="text-xs text-gray-400">Humidity</p>
              </div>
              <div className="text-center">
                <Wind size={18} className="text-gray-400 mx-auto mb-1" />
                <p className="text-sm font-semibold text-gray-800">
                  {Math.round(weather.current?.wind_kph)} km/h
                </p>
                <p className="text-xs text-gray-400">Wind</p>
              </div>
              <div className="text-center">
                <Thermometer size={18} className="text-orange-400 mx-auto mb-1" />
                <p className="text-sm font-semibold text-gray-800">UV {weather.current?.uv}</p>
                <p className="text-xs text-gray-400">UV Index</p>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-semibold text-gray-800 mb-3">5-Day Forecast</p>
            <div className="space-y-3">
              {weather.forecast?.forecastday?.map((day: any) => (
                <div key={day.date} className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 w-28">
                    {new Date(day.date).toLocaleDateString("en-KE", {
                      weekday: "short", month: "short", day: "numeric",
                    })}
                  </p>
                  <div className="flex items-center gap-1">
                    {day.condition?.icon && (
  <img
    src={`https:${day.condition.icon}`}
    alt={day.condition?.text || "weather"}
    className="w-8 h-8"
  />
)}
                    {day.daily_chance_of_rain > 30 && (
                      <span className="text-xs text-blue-500">{day.daily_chance_of_rain}%</span>
                    )}
                  </div>
                  <div className="flex gap-3 text-sm">
                    <span className="font-semibold text-gray-800">{Math.round(day.maxtemp_c)}°</span>
                    <span className="text-gray-400">{Math.round(day.mintemp_c)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advisory */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-800 mb-1">🌾 Farming Advisory</p>
            <p className="text-sm text-amber-700">{getFarmingAdvisory(weather)}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherTab;