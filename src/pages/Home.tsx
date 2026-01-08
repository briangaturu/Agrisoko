
import Navbar from "../components/Navbar";  


import Hero from "../components/Home/hero.tsx";
import Features from "../components/Home/features.tsx";
import HowItWorks from "../components/Home/HowItWorks.tsx";
import FeaturedProjects from "../components/Home/FeaturedProjects.tsx";
import CropInsightsPreview from "../components/Home/CropInsightsPreview.tsx";
import CallToAction from "../components/Home/CallToAction.tsx";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <FeaturedProjects />
      <CropInsightsPreview />
      <CallToAction />
    </div>
  );
};

export default Home;
