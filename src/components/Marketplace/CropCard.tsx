// src/components/Marketplace/CropCard.tsx
import { Link } from "react-router-dom";

interface CropCardProps {
  name: string;
  image: string;
  price: number;
  quantity: number;
  farmer: string;
}

const CropCard = ({ name, image, price, quantity, farmer }: CropCardProps) => {
  return (
    <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      
      {/* Image */}
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Title + Price */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900">{name}</h3>

          <span className="text-lg font-bold text-green-600">
            KES {price}
          </span>
        </div>

        {/* Farmer */}
        <p className="text-sm text-gray-600 mb-1">
          Farmer: <span className="font-medium">{farmer}</span>
        </p>

        {/* Quantity */}
        <p className="text-sm text-gray-500 mb-4">
          Available: {quantity} kg
        </p>

        {/* Button */}
        <Link
          to={`/chat/${farmer}`}
          className="mt-auto block text-center py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
        >
          Contact Farmer
        </Link>
      </div>
    </div>
  );
};

export default CropCard;
