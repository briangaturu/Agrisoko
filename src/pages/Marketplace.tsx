import Navbar from "../components/Navbar";
import MarketplaceHero from "../components/Marketplace/MarketplaceHero";
import MarketplaceFilters from "../components/Marketplace/MarketplaceFilters";
import MarketplaceGrid from "../components/Marketplace/MarketPlaceGrid";

const Marketplace = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <MarketplaceHero />

      <div className="max-w-7xl mx-auto px-4 md:flex gap-6 mt-8">
        {/* Filters Sidebar */}
        <div className="hidden md:block md:w-1/4">
          <MarketplaceFilters />
        </div>

        {/* Crop Listings */}
        <div className="flex-1">
          <MarketplaceGrid />
        </div>
      </div>
    </>
  );
};

export default Marketplace;
