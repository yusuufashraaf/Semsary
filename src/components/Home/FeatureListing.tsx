// FeatureListing.tsx
import ListingCard from "./ListingCard";
import styles from "./FeatureListing.module.css";
import { useFeaturedListings } from "@hooks/useFeatureListing";
import Loader from "@components/common/Loader/Loader";
import ErrorMessage from "@components/common/ErrorMessage/ErrorMessage";

export default function FeatureListing() {
  const { listings, loading, error } = useFeaturedListings();

  if (loading) return <Loader message="Loading featured listings..." /> 
  if (error) return <ErrorMessage message={error} /> 

  return (
    <section className={styles.featuredSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Featured Listings</h2>

        <div className="row g-4">
          {listings?.map((listing) => (
            <div key={listing.id} className="col-12 col-md-6 col-xl-4">
              <ListingCard {...listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
