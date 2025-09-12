import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  // Image loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link
      to={`/property/${property.id}`}
      className={`${styles.propertyCard} ${styles[viewMode]} ${styles.noLinkStyle}`}
    >
      {/* Property image, status, price, and wishlist button */}
      <div className={styles.propertyImage}>
        {isLoading ? (
          <div className={styles.imageLoader}></div>
        ) : (
          <img src={property.image} alt={property.title} loading="lazy" />
        )}

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
            toggleSavedProperty(property.id);
          }}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>

      {/* Property title, details, and description (list view only) */}
      <div className={styles.propertyInfo}>
        <h4 className={styles.propertyTitle}>{property.title}</h4>
        <div className={styles.propertyDetails}>
          <span>
            {property.beds === 0
              ? "Studio"
              : `${property.beds} bed${property.beds !== 1 ? "s" : ""}`}
          </span>
          <span>• </span>
          <span>
            {property.baths} bath{property.baths !== 1 ? "s" : ""}
          </span>
          <span>• </span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>
        {viewMode === "list" && (
          <p className={styles.propertyDescription}>{property.description}</p>
        )}
      </div>
    </Link>
  );
}
