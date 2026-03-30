// src/components/Marketplace/MarketplaceGrid.tsx
import CropCard from "./CropCard";
import { useGetListingsQuery } from "../../features/api/listingsApi";

const MarketplaceGrid = () => {
  const { data, isLoading, isError } = useGetListingsQuery(undefined);

  const listings = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  if (isLoading) {
    return <p className="text-center py-10">Loading crops...</p>;
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-red-600">
        Failed to load crops
      </p>
    );
  }

  if (listings.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No listings available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing: any) => (
       <CropCard
  key={listing.id}
  listingId={listing.id}        // ✅ add this
  name={listing.crop?.name || "Unknown Crop"}
  image={listing.crop?.cropUrl || ""}
  price={Number(listing.pricePerUnit)}
  quantity={listing.quantityAvailable}
  unit={listing.crop?.unit}
  farmer={listing.farmer?.fullName || "Unknown Farmer"}
  phone={listing.farmer?.phone || "Not provided"}
  location={listing.location}
  description={listing.description}
/>
      ))}
    </div>
  );
};

export default MarketplaceGrid;