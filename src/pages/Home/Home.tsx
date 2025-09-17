import HeroImage from "@components/Home/HeroImage";
import FeatureListing from "../../components/Home/FeatureListing";
import PopularCategories from "@components/Home/PopularCategories";

const Home = () => {
  return (
    <div className="homepage-container">
      <HeroImage />
      <FeatureListing />
      <PopularCategories />
    </div>
  );
};

export default Home;
