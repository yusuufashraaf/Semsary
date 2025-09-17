import styles from "./PropertCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { PropertyCardProps } from "src/types";

export default function PropertyCard({
  property,
  viewMode,
  savedProperties,
  toggleSavedProperty,
}: PropertyCardProps) {
  // Image loading simulation

  return (
    <Link
      to={`/property/${property.id}`}
      className={`${styles.propertyCard} ${styles[viewMode]} ${styles.noLinkStyle}`}
    >
      {/* Property image, status, price, and wishlist button */}
      <div className={styles.propertyImage}>
        {<img src={property.image} alt={property.title} loading="lazy" />}

        <div className={styles.propertyStatus}>
          {property.status && (
            <span
              className={`${styles.statusBadge} ${styles[property.status]}`}
            >
              {property.status.charAt(0).toUpperCase() +
                property.status.slice(1)}
            </span>
          )}
        </div>

        <div className={styles.propertyPrice}>
          {new Intl.NumberFormat("en-EG", {
            style: "currency",
            currency: "EGP",
            maximumFractionDigits: 0,
          }).format(property.price)}
        </div>

        <button
          className={`${styles.saveBtn} ${
            savedProperties.includes(property.id) ? styles.savedBtn : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            toggleSavedProperty(Number(property.id));
          }}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>

      {/* Property title, details, and description (list view only) */}
      <div className={styles.propertyInfo}>
        <h4 className={styles.propertyTitle}>{property.title}</h4>
        <div className={styles.propertyDetails}>
          {property.bedrooms != null && (
            <span>
              {property.bedrooms === 0
                ? "Studio"
                : `${property.bedrooms} bed${
                    property.bedrooms !== 1 ? "s" : ""
                  }`}
            </span>
          )}
          {property.bedrooms != null && property.bathrooms != null && (
            <span> • </span>
          )}
          {property.bathrooms != null && (
            <span>
              {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
            </span>
          )}
          {(property.bedrooms != null || property.bathrooms != null) &&
            property.sqft != null && <span> • </span>}
          {property.sqft != null && (
            <span>{property.sqft.toLocaleString()} sqft</span>
          )}
        </div>
        {viewMode === "list" && (
          <p className={styles.propertyDescription}>{property.description}</p>
        )}
      </div>
    </Link>
  );
}
