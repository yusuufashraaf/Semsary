import React, { useEffect, useMemo, Suspense } from "react";
import { useParams } from "react-router-dom";
import styles from "./PropertyDetails.module.css";

import BreadCrumb from "@components/PropertyDetails/BreadCrumb";
import ImageCarousel from "@components/PropertyDetails/ImageCarousel";
import LoadingScreen from "@components/common/LoaderScreen/LoadingScreen";
import ErrorScreen from "@components/common/ErrorScreen/ErrorScreen";
import ActionButtons from "@components/PropertyDetails/ActionButtons";

import { Property, GuestOption } from "src/types";
import { useReviews } from "@hooks/useReviews";
import { useBooking } from "@hooks/useBooking";
import { useSimilarProperties } from "@hooks/useSimilarProperties";
import { usePropertyDetails } from "@hooks/usePropertyDetails";
import PropertyContent from "./PropertyContent";
import BookingSection from "./BookingSection";
import { mapListingToProperty } from "@utils/propertyMapper";

// Lazy-load SimilarSection for performance
const SimilarSection = React.lazy(() => import("./SimilarSection"));

// Guest dropdown options
const guestOptions: GuestOption[] = [
  { value: "1", label: "1 guest" },
  { value: "2", label: "2 guests" },
  { value: "3", label: "3 guests" },
  { value: "4", label: "4 guests" },
  { value: "5", label: "5+ guests" },
];

function PropertyListing() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ? parseInt(id, 10) : null;

  // Property details
  const {
    property: listing,
    loading: loadingPage,
    error,
    refetch,
  } = usePropertyDetails(propertyId);

  const property: Property | null = useMemo(
    () => (listing ? mapListingToProperty(listing) : null),
    [listing]
  );

  // ✅ Reviews hook (propertyId is bound inside)
  const {
    reviews,
    total: reviewsTotal,
    loading: reviewsLoading,
    fetchReviews,
  } = useReviews(propertyId);

  // Similar properties
  const { data: similarProperties, loading: similarLoading } =
    useSimilarProperties();

  // Booking
  const booking = useBooking(property);

  // Auto fetch reviews when propertyId is available
  useEffect(() => {
    if (propertyId) {
      fetchReviews(1);
    }
  }, [propertyId, fetchReviews]);

  // Missing propertyId in URL
  if (!propertyId) {
    return (
      <ErrorScreen
        title="Invalid URL"
        message="No property ID provided in the URL."
        icon="⚠️"
      />
    );
  }

  // Loading state
  if (loadingPage) {
    return <LoadingScreen propertyId={String(propertyId)} />;
  }

  // Error or missing property
  if (error || !property) {
    return (
      <ErrorScreen
        title="Property Not Found"
        message={
          error || `Property with ID "${propertyId}" could not be loaded.`
        }
        icon="🏠"
        onAction={() => refetch()}
        actionLabel="Try Again"
      />
    );
  }

  // Normal render
  return (
    <div className={styles.propertyContainer}>
      <BreadCrumb propertyId={String(propertyId)} />

      <ImageCarousel
        images={property.images}
        isSaved={false}
        onToggleSaved={(e) => e.preventDefault()}
        aria-label={`Image carousel for ${property.title}`}
      />

      <div className="row">
        <PropertyContent
          property={property}
          reviews={reviews}
          totalReviews={reviewsTotal}
          onPageChange={fetchReviews}
          loading={reviewsLoading}
        />

        <BookingSection
          property={property}
          booking={booking}
          guestOptions={guestOptions}
        />
      </div>

      <div className="row mt-4">
        <Suspense fallback={<LoadingScreen propertyId={String(propertyId)} />}>
          <SimilarSection
            properties={similarProperties}
            loading={similarLoading}
          />
        </Suspense>
      </div>

      <ActionButtons
        onContact={() => alert("Contact clicked")}
        onViewMore={() => alert("View More clicked")}
        disabledButton={null}
      />
    </div>
  );
}

export default PropertyListing;
