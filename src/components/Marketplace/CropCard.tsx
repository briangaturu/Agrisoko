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
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-gray-600">Farmer: {farmer}</p>
      <p className="text-gray-700 font-semibold mt-1">KES {price}</p>
      <p className="text-gray-500">Available: {quantity} kg</p>
      <Link
        to={`/chat/${farmer}`}
        className="mt-auto block text-center py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
      >
        Contact Farmer
      </Link>
    </div>
  );
};

export default CropCard;
