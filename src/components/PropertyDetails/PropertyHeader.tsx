import styles from "./PropertyHeader.module.css";
import { PropertyHeaderProps } from "src/types";

/* 
  PropertyHeader component
  - Displays the property address (title)
  - Shows metadata such as property type, rating, and review count
*/
function PropertyHeader({
  address,
  type,
  rating,
  reviewCount,
}: PropertyHeaderProps) {
  return (
    <header className={styles.header}>
      {/* Property title / address */}
      <h1 className={styles.title}>{address}</h1>

      {/* Metadata section: property type and rating with review count */}
      <div className={styles.meta}>
        <span className={styles.type}>• {type}</span>
        <span className={styles.rating}>
          ★ {rating} ({reviewCount})
        </span>
      </div>
    </header>
  );
}

export default PropertyHeader;
