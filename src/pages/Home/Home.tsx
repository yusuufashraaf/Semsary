import HeroImage from "@components/Home/HeroImage";
import FeatureListing from "./FeatureListing";

const Home = () => {
  return (
    <div className="homepage-container">
      <HeroImage />
      <FeatureListing />
    </div>
  );
};

export default Home;
