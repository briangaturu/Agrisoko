// src/components/Marketplace/MarketplaceGrid.tsx
import CropCard from "./CropCard";

// Dummy data for now
const crops = [
  {
    name: "Tomatoes",
    image: "https://via.placeholder.com/300",
    price: 120,
    quantity: 50,
    farmer: "John Doe",
  },
  {
    name: "Spinach",
    image: "https://via.placeholder.com/300",
    price: 80,
    quantity: 30,
    farmer: "Mary Jane",
  },
  {
    name: "Carrots",
    image: "https://via.placeholder.com/300",
    price: 100,
    quantity: 20,
    farmer: "David Kimani",
  },
];

const MarketplaceGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {crops.map((crop, index) => (
        <CropCard
          key={index}
          name={crop.name}
          image={crop.image}
          price={crop.price}
          quantity={crop.quantity}
          farmer={crop.farmer}
        />
      ))}
    </div>
  );
};

export default MarketplaceGrid;
