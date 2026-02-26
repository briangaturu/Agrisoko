import Header from "../components/Header";
import MarketplaceHero from "../components/Marketplace/MarketplaceHero";
import MarketplaceFilters from "../components/Marketplace/MarketplaceFilters";
import MarketplaceGrid from "../components/Marketplace/MarketPlaceGrid";

const Marketplace = () => {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <MarketplaceHero />

      <div className="max-w-7xl mx-auto px-4 mt-10 space-y-8">

        {/* Filters Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-gray-200">
          <MarketplaceFilters />
        </div>

        {/* Crop Listings */}
        <div>
          <MarketplaceGrid />
        </div>

      </div>
    </>
  );
};

export default Marketplace;
