import HeroImage from "@components/Home/HeroImage";
import FeatureListing from "../../components/Home/FeatureListing";
import PopularCategories from "@components/Home/PopularCategories";
import AllProperties from "@components/Home/AllProperties";

const Home = () => {
  return (
    <div className="homepage-container">
      <HeroImage />
      <FeatureListing />
      <PopularCategories />
      <AllProperties />
    </div>
  );
};

export default Home;
