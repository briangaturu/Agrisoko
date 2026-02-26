
import Header from "../components/Header";  


import Hero from "../components/Home/hero.tsx";
import Features from "../components/Home/features.tsx";
import HowItWorks from "../components/Home/HowItWorks.tsx";
import FeaturedProjects from "../components/Home/FeaturedProjects.tsx";
import CropInsightsPreview from "../components/Home/CropInsightsPreview.tsx";
import CallToAction from "../components/Home/CallToAction.tsx";
import Footer from "../components/Footer.tsx";

const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <FeaturedProjects />
      <CropInsightsPreview />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
