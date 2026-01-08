import Navbar from "../components/Navbar";
import AboutHero from "../components/About/AboutHero";
import MissionVision from "../components/About/MissionVision";
import ProblemSolution from "../components/About/ProblemSolution";
import OurValues from "../components/About/OurValues";
import HowPlatformHelps from "../components/About/HowPlatformHelps";

const About = () => {
  return (
    <div>
        <Navbar />
      <AboutHero />
      <MissionVision />
      <ProblemSolution />
      <OurValues />
      <HowPlatformHelps />
    </div>
  );
};

export default About;