// ListingCard.tsx
import { Link } from "react-router-dom";
import styles from "./FeatureListing.module.css";
import { Listing } from "src/types";
export default function ListingCard({
  id,
  image,
  title,
  bedrooms,
  bathrooms,
  sqft,
  price,
}: Listing) {
  return (
    <div className={`${styles.card} card h-100 shadow-sm`}>
      <div className={styles.imageWrapper}>
        <Link to={`/property/${id}`}>
          <img src={image} className={styles.cardImg} alt={title} />
        </Link>
        <span className={`${styles.priceBadge} badge`}>{price}</span>
      </div>

      <div className="card-body">
        <h5 className={styles.propertyTitle}>{title}</h5>
        <div className={styles.propertyDetails}>
          <span>{bedrooms} beds</span>
          <span>• {bathrooms} baths</span>
          <span>• {sqft}</span>
        </div>
      </div>
    </div>
  );
}
