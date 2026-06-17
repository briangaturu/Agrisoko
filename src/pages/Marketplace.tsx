import Header from "../components/Header";
import MarketplaceHero from "../components/Marketplace/MarketplaceHero";
import MarketplaceFilters from "../components/Marketplace/MarketplaceFilters";
import MarketplaceGrid from "../components/Marketplace/MarketPlaceGrid";
import { useMemo, useState } from "react";
import { useGetListingsQuery } from "../features/api/listingsApi";
import { type Listing } from "../components/Insights/constants";

const Marketplace = () => {
  const [cropType, setCropType] = useState("");
  const [location, setLocation] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data, isLoading, isError } = useGetListingsQuery(undefined);

  const listings: Listing[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const filteredListings = useMemo(() => {
    const cropFilter = cropType.trim().toLowerCase();
    const locationFilter = location.trim().toLowerCase();
    const parsedMaxPrice = Number(maxPrice);
    const hasValidMaxPrice = maxPrice.trim().length > 0 && !Number.isNaN(parsedMaxPrice);

    return listings.filter((listing) => {
      const cropName = listing.crop?.name?.toLowerCase() ?? "";
      const listingLocation = listing.location?.toLowerCase() ?? "";
      const listingPrice = Number(listing.pricePerUnit);
      const isActive = listing.status === "ACTIVE";

      if (!isActive) return false;
      if (cropFilter && !cropName.includes(cropFilter)) return false;
      if (locationFilter && !listingLocation.includes(locationFilter)) return false;
      if (hasValidMaxPrice && listingPrice > parsedMaxPrice) return false;

      return true;
    });
  }, [listings, cropType, location, maxPrice]);

  const handleResetFilters = () => {
    setCropType("");
    setLocation("");
    setMaxPrice("");
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <MarketplaceHero />

      <div className="max-w-7xl mx-auto px-4 mt-10 space-y-8">

        {/* Filters Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-gray-200">
          <MarketplaceFilters
            cropType={cropType}
            location={location}
            maxPrice={maxPrice}
            onCropTypeChange={setCropType}
            onLocationChange={setLocation}
            onMaxPriceChange={setMaxPrice}
            onReset={handleResetFilters}
          />
        </div>

        {/* Crop Listings */}
        <div>
          <MarketplaceGrid
            listings={filteredListings}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

      </div>
    </>
  );
};

export default Marketplace;
