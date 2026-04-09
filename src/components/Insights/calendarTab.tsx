import { Sprout } from "lucide-react";
import { PLANTING_CALENDAR, CROP_EMOJIS, SHORT_MONTHS } from "./constants";

const currentMonth = new Date().getMonth();

const CalendarTab = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-gray-800">Seasonal Planting Calendar</h2>
    <p className="text-xs text-gray-400 -mt-2">Green = Plant · Current month highlighted</p>

    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-3 text-left text-xs font-semibold text-gray-500 w-24">Crop</th>
            {SHORT_MONTHS.map((m, i) => (
              <th key={m} className={`p-2 text-center text-xs font-semibold ${
                i === currentMonth ? "bg-green-100 text-green-700" : "text-gray-500"
              }`}>
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(PLANTING_CALENDAR).map(([crop, plantMonths]) => (
            <tr key={crop} className="border-b last:border-0 hover:bg-gray-50 transition">
              <td className="p-3 text-sm font-medium text-gray-700 whitespace-nowrap">
                {CROP_EMOJIS[crop] || "🌱"} {crop}
              </td>
              {SHORT_MONTHS.map((_, i) => (
                <td key={i} className={`p-2 text-center ${i === currentMonth ? "bg-green-50" : ""}`}>
                  {plantMonths.includes(i) && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <Sprout size={12} className="text-white" />
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex items-center gap-4 text-xs text-gray-500">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <Sprout size={10} className="text-white" />
        </div>
        Planting season
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 bg-green-100 rounded border border-green-300" />
        Current month
      </div>
    </div>
  </div>
);

export default CalendarTab;