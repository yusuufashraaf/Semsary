import styles from "./SimilarPropertyCard.module.css";
import { SimilarPropertyCardProps } from "src/types";
import Loader from "@components/common/Loader/Loader";
import { formatCurrency } from "@utils/HelperFunctions";

/**
 * SimilarPropertyCard component
 * - Displays a single suggested/similar property
 * - Shows loader while fetching data
 * - Handles empty property gracefully
 */
function SimilarPropertyCard({ property, loading }: SimilarPropertyCardProps) {
  if (loading) {
    return <Loader message="Loading similar properties..." />;
  }

  if (!property) {
    return <p className={styles.noProperty}>No property data available.</p>;
  }

  return (
    <div className={styles.card}>
      <img src={property.image} alt={property.title ?? "Property"} />
      <div className={styles.details}>
        <div className={styles.locationRating}>
          <small className={styles.location}>{property.location}</small>
          {property.rating !== undefined && (
            <div className={styles.rating}>
              <span>★</span>
              <small>{property.rating}</small>
            </div>
          )}
        </div>
        <h6 className={styles.title}>{property.title}</h6>
        <p className={styles.price}>{formatCurrency(property.price)}</p>
      </div>
    </div>
  );
}

export default SimilarPropertyCard;
