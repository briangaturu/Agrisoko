// src/components/Insights/InsightsGrid.tsx
import CropInsightCard from "./CropInsightsCard";

// Dummy data
const insights = [
  { name: "Tomatoes", region: "Kiambu", season: "Jan - Mar", availability: "High" },
  { name: "Spinach", region: "Nyeri", season: "Feb - Apr", availability: "Medium" },
  { name: "Carrots", region: "Murang’a", season: "Mar - May", availability: "Low" },
];

const InsightsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {insights.map((insight, index) => (
        <CropInsightCard
          key={index}
          name={insight.name}
          region={insight.region}
          season={insight.season}
          availability={insight.availability}
        />
      ))}
    </div>
  );
};

export default InsightsGrid;
