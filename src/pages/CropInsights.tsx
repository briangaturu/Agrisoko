import { useState, useEffect, useRef } from "react";
import {
  TrendingUp, Cloud, Sprout, Calendar, MapPin, AlertTriangle,
} from "lucide-react";

import AIInsightCard   from "../components/Insights/AIInsightsCard";
import PricesTab       from "../components/Insights/pricesTab";
import WeatherTab      from "../components/Insights/weatherTab";
import DiseaseTab      from "../components/Insights/DiseaseTab";
import TipsTab         from "../components/Insights/TipsTab";
import CalendarTab     from "../components/Insights/calendarTab";
import AvailabilityTab from "../components/Insights/AvailabilityTab";
import { type AIInsight } from "../components/Insights/constants";
import Header from "../components/Header";

const API_BASE = "http://localhost:5000/api/external";

type Tab = "prices" | "weather" | "tips" | "calendar" | "availability" | "disease";

const TABS = [
  { key: "prices",       label: "Prices",       icon: TrendingUp    },
  { key: "weather",      label: "Weather",      icon: Cloud         },
  { key: "disease",      label: "Disease",      icon: AlertTriangle },
  { key: "tips",         label: "Tips",         icon: Sprout        },
  { key: "calendar",     label: "Calendar",     icon: Calendar      },
  { key: "availability", label: "Find Produce", icon: MapPin        },
] as const;

const CropInsights = () => {
  const [activeTab,    setActiveTab]    = useState<Tab>("prices");
  const [selectedCrop, setSelectedCrop] = useState("Maize");
  const [aiInsight,    setAiInsight]    = useState<AIInsight | null>(null);
  const [aiLoading,    setAiLoading]    = useState(false);
  const [aiError,      setAiError]      = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Fetch AI insight from backend ──────────────────────────────────────────
  const fetchAIInsight = async (crop: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setAiLoading(true);
    setAiError(null);
    setAiInsight(null);

    try {
      const res = await fetch(`${API_BASE}/ai-insight`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        signal:  abortRef.current.signal,
        body:    JSON.stringify({ crop }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "AI insight failed");

      setAiInsight(data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setAiError("Failed to load AI insight. Please try again.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsight(selectedCrop);
    return () => abortRef.current?.abort();
  }, [selectedCrop]);

  const showAICard = activeTab !== "availability" && activeTab !== "disease";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />
      {/* ── Header + Tabs ── */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sprout className="text-green-600" size={26} />
                Crop Insights
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                AI-powered market intelligence for Kenyan farmers
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">Live</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 bg-gray-100 p-1 rounded-xl overflow-x-auto">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  activeTab === key
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* AI Insight Card */}
        {showAICard && (
          <AIInsightCard
            selectedCrop={selectedCrop}
            aiInsight={aiInsight}
            aiLoading={aiLoading}
            aiError={aiError}
            onRefresh={() => fetchAIInsight(selectedCrop)}
            onSelectCrop={setSelectedCrop}
          />
        )}

        {activeTab === "prices"       && <PricesTab       selectedCrop={selectedCrop} onSelectCrop={setSelectedCrop} />}
        {activeTab === "weather"      && <WeatherTab />}
        {activeTab === "disease"      && <DiseaseTab />}
        {activeTab === "tips"         && <TipsTab         selectedCrop={selectedCrop} aiInsight={aiInsight} aiLoading={aiLoading} onSelectCrop={setSelectedCrop} />}
        {activeTab === "calendar"     && <CalendarTab />}
        {activeTab === "availability" && <AvailabilityTab />}
      </div>
    </div>
  );
};

export default CropInsights;