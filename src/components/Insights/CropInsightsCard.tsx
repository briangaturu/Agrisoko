// src/components/Insights/CropInsightCard.tsx
interface CropInsightCardProps {
    name: string;
    region: string;
    season: string;
    availability: string; // e.g., "High / Medium / Low"
  }
  
  const CropInsightCard = ({ name, region, season, availability }: CropInsightCardProps) => {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex flex-col">
        <h3 className="text-lg font-bold mb-2">{name}</h3>
        <p className="text-gray-600 mb-1">Region: {region}</p>
        <p className="text-gray-600 mb-1">Season: {season}</p>
        <p className="text-gray-700 font-semibold">Availability: {availability}</p>
      </div>
    );
  };
  
  export default CropInsightCard;
  