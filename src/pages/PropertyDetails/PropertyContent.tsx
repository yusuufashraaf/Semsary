import React from "react";
import PropertyHeader from "@components/PropertyDetails/PropertyHeader";
import PropertyDetailsCard from "@components/PropertyDetails/PropertyDetailsCard";
import HostCard from "@components/PropertyDetails/HostCard";
import LocationMap from "@components/PropertyDetails/LocationMap";
import ReviewItem from "@components/PropertyDetails/ReviewItem";
import PropertyReviewAnalysis from "./PropertyReviewAnalysis";
import { Props } from "src/types";
import styles from "./PropertyDetails.module.css";

/**
 * PropertyContent component
 *
 * Renders the main content section of a property details page.
 * Includes header info, details, host card, location map, and reviews.
 *
 */
function PropertyContent({
  property,
  reviews,
  totalReviews,
  onPageChange,
  loading,
}: Props) {
  return (
    <div className="col-lg-8">
      {/* Property Header: shows address, type, rating, and review count */}
      <PropertyHeader
        address={property.address ?? ""}
        type={property.type ?? ""}
        rating={property.rating ?? 0}
        reviewCount={property.reviewCount ?? 0}
      />

      {/* Property Details: description, bedrooms, bathrooms, sqft, amenities */}
      <PropertyDetailsCard
        description={property.description}
        bedrooms={property.bedrooms}
        bathrooms={property.bathrooms}
        sqft={property.sqft}
        amenities={property.amenities}
      />

      {/* Host information card */}
      <HostCard host={property.host} />

      {/* Location map with coordinates */}
      <div className={styles.glassCard}>
        <LocationMap
          lat={property.coordinates.lat}
          lng={property.coordinates.lng}
        />
      </div>

      {/* Reviews section with pagination */}
      <ReviewItem
        reviews={reviews}
        reviewsPerPage={3}
        totalReviews={totalReviews}
        onPageChange={onPageChange}
        loading={loading}
      />
      <PropertyReviewAnalysis propertyId={Number(property.id)} totalReviews={Number(totalReviews)} />
    </div>
  );
}

export default React.memo(PropertyContent);
