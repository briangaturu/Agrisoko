import Header from "../components/Header";
import InsightsHero from "../components/Insights/InsightsHero";
import InsightsFilters from "../components/Insights/InsightsFilter";
import InsightsGrid from "../components/Insights/InsightsGrid";

const CropInsights = () => {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <InsightsHero />

      <div className="max-w-7xl mx-auto px-4 md:flex gap-6 mt-8">
        {/* Filters Sidebar */}
        <div className="hidden md:block md:w-1/4">
          <InsightsFilters />
        </div>

        {/* Insights Grid */}
        <div className="flex-1">
          <InsightsGrid />
        </div>
      </div>
    </>
  );
};

export default CropInsights;
