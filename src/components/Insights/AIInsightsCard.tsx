import { Loader2, RefreshCw } from "lucide-react";
import type { AIInsight, CropPrice } from "./constants";
import { KENYAN_CROPS } from "./constants";

const API_BASE = "http://localhost:5000/api/external";

interface Props {
  selectedCrop: string;
  aiInsight: AIInsight | null;
  aiLoading: boolean;
  aiError: string | null;
  onRefresh: () => void;
  onSelectCrop: (crop: string) => void;
}

const AIInsightCard = ({
  selectedCrop,
  aiInsight,
  aiLoading,
  aiError,
  onRefresh,
  onSelectCrop,
}: Props) => (
  <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 text-white shadow-lg">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg">
          🤖
        </div>
        <div>
          <p className="text-xs text-green-200 font-medium uppercase tracking-wide">AI Insight</p>
          <p className="text-sm font-semibold">{selectedCrop}</p>
        </div>
      </div>
      <button
        onClick={onRefresh}
        disabled={aiLoading}
        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition disabled:opacity-50"
      >
        <RefreshCw size={15} className={aiLoading ? "animate-spin" : ""} />
      </button>
    </div>

    {aiLoading && (
      <div className="flex items-center gap-2 text-green-200">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm">Generating insight...</span>
      </div>
    )}
    {aiError && <p className="text-red-300 text-sm">{aiError}</p>}
    {aiInsight && !aiLoading && (
      <div className="space-y-1">
        <h3 className="font-bold text-lg leading-tight">{aiInsight.title}</h3>
        <p className="text-green-100 text-sm leading-relaxed">{aiInsight.body}</p>
      </div>
    )}

    <div className="flex gap-2 mt-4 flex-wrap">
      {KENYAN_CROPS.slice(0, 5).map((c: CropPrice) => (
        <button
          key={c.name}
          onClick={() => onSelectCrop(c.name)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            selectedCrop === c.name
              ? "bg-white text-green-700"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          {c.emoji} {c.name}
        </button>
      ))}
    </div>
  </div>
);

export default AIInsightCard;
export { API_BASE };