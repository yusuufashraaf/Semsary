import { useEffect, useState, useMemo } from "react";
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
import PropertyContent from "./PropertyContent";
import BookingSection from "./BookingSection";
import SimilarSection from "./SimilarSection";

// Mock Database (IDs are strings but casted later for comparison)
const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    address: "Zamalek, Cairo",
    price: 1800,
    type: "Studio Apartment",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 600,
    description: "Cozy studio apartment with Nile view.",
    images: [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=2075&q=80",
    ],
    rating: 4.2,
    reviewCount: 0,
    coordinates: { lat: 30.061, lng: 31.22 },
    amenities: ["WiFi", "AC", "Elevator"],
    host: {
      name: "Omar Ali",
      avatar: "OA",
      joinDate: "Joined in 2021",
    },
  },
  {
    id: "2",
    address: "15 Tahrir Square, Downtown, Cairo",
    price: 2500,
    type: "Entire Apartment",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1400,
    description: "Bright, modern apartment in the heart of the city.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2075&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2053&q=80",
    ],
    rating: 4.6,
    reviewCount: 0,
    coordinates: { lat: 30.05623, lng: 31.174386 },
    amenities: ["WiFi", "Kitchen", "Parking", "AC", "Washer"],
    host: {
      name: "Sarah Johnson",
      avatar: "SJ",
      joinDate: "Joined in 2020",
    },
  },
];

function PropertyListing() {
  //  Get propertyId from URL params
  // parseInt ensures ID is numeric
  const { id } = useParams<{ id: string }>();
  const propertyId = id ? parseInt(id, 10) : null;

  //  Component state
  const [property, setProperty] = useState<Property | null>(null);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);

  //  Custom hooks for reviews, booking, similar properties
  const {
    reviews,
    total: reviewsTotal,
    loading: reviewsLoading,
    fetchReviews,
  } = useReviews();

  const { data: similarProperties, loading: similarLoading } =
    useSimilarProperties();

  const booking = useBooking(property);

  //  Guest dropdown options are memoized (better performance)
  const guestOptions: GuestOption[] = useMemo(
    () => [
      { value: "1", label: "1 guest" },
      { value: "2", label: "2 guests" },
      { value: "3", label: "3 guests" },
      { value: "4", label: "4 guests" },
      { value: "5", label: "5+ guests" },
    ],
    []
  );

  // If propertyId is missing from URL
  if (!propertyId) {
    return (
      <ErrorScreen
        title="Invalid URL"
        message="No property ID provided in the URL."
        icon="⚠️"
      />
    );
  }

  // Simulate fetching property from "database" by ID
  useEffect(() => {
    setLoadingPage(true);

    setTimeout(() => {
      // compare numeric (Number(p.id)) with propertyId
      const found =
        MOCK_PROPERTIES.find((p) => Number(p.id) === propertyId) || null;

      setProperty(found);
      setLoadingPage(false);

      // load reviews only if property exists
      if (found) fetchReviews(1);
    }, 800);
  }, [propertyId, fetchReviews]);

  // Show loading screen while "fetching"
  if (loadingPage) return <LoadingScreen propertyId={String(propertyId)} />;

  // Show error screen if property not found
  if (!property) {
    return (
      <ErrorScreen
        title="Property Not Found"
        message={`Property with ID "${propertyId}" could not be loaded.`}
        icon="🏠"
      />
    );
  }

  // Normal render when property is available
  return (
    <div className={styles.propertyContainer}>
      <BreadCrumb propertyId={String(propertyId)} />

      <ImageCarousel
        images={property.images}
        isSaved={false}
        onToggleSaved={(e) => {
          e.preventDefault();
          console.log("hello");
        }}
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
        <SimilarSection
          properties={similarProperties}
          loading={similarLoading}
        />
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
