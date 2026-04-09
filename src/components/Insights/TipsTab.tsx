import { Loader2 } from "lucide-react";
import { KENYAN_CROPS, GROWING_TIPS, type AIInsight } from "./constants";

interface Props {
  selectedCrop: string;
  aiInsight: AIInsight | null;
  aiLoading: boolean;
  onSelectCrop: (crop: string) => void;
}

const TipsTab = ({ selectedCrop, aiInsight, aiLoading, onSelectCrop }: Props) => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-gray-800">Crop Growing Tips</h2>

    <div className="space-y-3">
      {GROWING_TIPS.map((tip) => (
        <div key={tip.crop} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
          <span className="text-3xl flex-shrink-0">{tip.icon}</span>
          <div>
            <p className="font-semibold text-gray-900 mb-1">{tip.crop}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{tip.tip}</p>
          </div>
        </div>
      ))}
    </div>

    {/* AI tip for selected crop */}
    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
        🤖 AI Tip for {selectedCrop}
      </p>
      {aiLoading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      ) : aiInsight ? (
        <p className="text-sm text-gray-700 leading-relaxed">{aiInsight.body}</p>
      ) : (
        <p className="text-sm text-gray-400">Select a crop above to get an AI tip.</p>
      )}
    </div>

    {/* Crop selector */}
    <div className="flex gap-2 flex-wrap">
      {KENYAN_CROPS.map((c) => (
        <button
          key={c.name}
          onClick={() => onSelectCrop(c.name)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
            selectedCrop === c.name
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
          }`}
        >
          {c.emoji} {c.name}
        </button>
      ))}
    </div>
  </div>
);

export default TipsTab;