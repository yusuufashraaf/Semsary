import styles from "./PropertyDetailsCard.module.css";
import AmenitiesList from "./AmenitiesList";
import { Bed, Bath, Ruler } from "lucide-react";
import { PropertyDetailsCardProps } from "src/types";

// Component: PropertyDetailsCard
// Purpose: Displays property details such as description, stats (bed/bath/sqft), and amenities.
// Props: Imported from types.ts (PropertyDetailsCardProps)
function PropertyDetailsCard({
  description,
  bedrooms,
  bathrooms,
  sqft,
  amenities = [],
}: PropertyDetailsCardProps) {
  return (
    <div className={styles.card}>
      {/* Description Section */}
      <h3 className={styles.heading}>About this place</h3>
      <p className={styles.description}>
        {description || "No description available for this property."}
      </p>

      {/* Property Stats */}
      <div className={styles.stats}>
        <div>
          <Bed className={styles.icon} size={18} /> {bedrooms ?? "N/A"} Bedrooms
        </div>
        <div>
          <Bath className={styles.icon} size={18} /> {bathrooms ?? "N/A"}{" "}
          Bathrooms
        </div>
        <div>
          <Ruler className={styles.icon} size={18} />{" "}
          {sqft ? `${sqft.toLocaleString()} sq ft` : "N/A"}
        </div>
      </div>

      {/* Amenities Section */}
      <h5 className={styles.subHeading}>What this place offers</h5>
      {amenities.length > 0 ? (
        <AmenitiesList amenities={amenities} />
      ) : (
        <p className={styles.noAmenities}>No amenities listed.</p>
      )}
    </div>
  );
}

export default PropertyDetailsCard;
