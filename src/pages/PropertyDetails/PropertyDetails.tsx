import  { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./PropertyDetails.module.css";

import BreadCrumb from "@components/PropertyDetails/BreadCrumb";
import ImageCarousel from "@components/PropertyDetails/ImageCarousel";
import LoadingScreen from "@components/common/LoaderScreen/LoadingScreen";
import ErrorScreen from "@components/common/ErrorScreen/ErrorScreen";

import { Property, GuestOption } from "src/types";
import { RootState } from "@store/index";
import { useReviews } from "@hooks/useReviews";
import { useBooking } from "@hooks/useBooking";
import { usePropertyDetails } from "@hooks/usePropertyDetails";
import { useRentRequests } from "@hooks/useRentRequest";
import PropertyContent from "./PropertyContent";
import BookingSection from "./BookingSection";
import { mapListingToProperty } from "@utils/propertyMapper";
import { useWishlist } from "@hooks/useWishlist";
import { toast } from "react-toastify";
import { getUnavailableDates } from "@services/rentRequest"; 

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

  // Get current user from Redux
  const user = useSelector((state: RootState) => state.Authslice.user);

  // State for unavailable dates
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

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

  // Wishlist hook
  const { isSaved, toggleWishlist } = useWishlist(propertyId ?? 0);

  const {
    reviews,
    total: reviewsTotal,
    loading: reviewsLoading,
    fetchReviews,
  } = useReviews(propertyId);

  // Rent requests hook
  const { createRequest, loading: rentRequestLoading } = useRentRequests(user?.id || null);

  // Booking
  const booking = useBooking(property);
const { jwt } = useSelector((state: RootState) => state.Authslice);
  // Fetch unavailable dates
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      if (propertyId) {
        try {
          const dates = await getUnavailableDates(
            propertyId,
            jwt! // Pass JWT if user is logged in, otherwise undefined
          );
          
          // Convert string dates to Date objects
          const dateObjects = dates.flatMap(dateRange => {
            const checkIn = new Date(dateRange.check_in);
            const checkOut = new Date(dateRange.check_out);
            const dates: Date[] = [];
            
            // Create array of all dates between check_in and check_out (inclusive)
            for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
              dates.push(new Date(d));
            }
            
            return dates;
          });
          
          setUnavailableDates(dateObjects);
        } catch (error) {
          console.error("Failed to fetch unavailable dates:", error);
          // Set empty array on error (handled in API function)
          setUnavailableDates([]);
        }
      }
    };

    fetchUnavailableDates();
  }, [propertyId, jwt]);

  // Enhanced reserve handler that creates rent request
  const handleReserveWithRentRequest = async () => {
    if (!user) {
      toast.error("Please login to make a reservation");
      return;
    }

    if (!property) {
      toast.error("Property information is not available");
      return;
    }

    // Validate booking details first
    if (!booking.checkIn || !booking.checkOut || !booking.guests) {
      toast.error("Please fill in all booking details");
      return;
    }

    try {
      // Create rent request data
      const rentRequestData = {
        property_id: Number(property.id),
        user_id: user.id,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
      };

      // Create the rent request
      const newRequest = await createRequest(rentRequestData);

      toast.success("Rent request submitted successfully!");
      console.log("Rent request created:", newRequest);

    } catch (error: any) {
      console.error("Failed to create rent request:", error);

      // Display error message coming from backend if available
      const errorMessage = error.response?.data?.message || "Failed to submit rent request. Please try again.";
      
      toast.error(errorMessage);
    }
  };

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
    return <LoadingScreen />;
  }

  // Error or missing property
  if (error || !property) {
    return (
      <ErrorScreen
        title="Property Not Found"
        message={error || `Property with ID "${propertyId}" could not be loaded.`}
        icon="🏠"
        onAction={() => refetch()}
        actionLabel="Try Again"
      />
    );
  }

  // Combine errors from booking into a single message string for the BookingCard component
  const errorMessage = [
    booking.errors.checkIn,
    booking.errors.checkOut,
    booking.errors.guests,
    booking.apiError,
  ].filter(Boolean).join(" ");

  // Normal render
  return (
    <div className={styles.propertyContainer}>
      <BreadCrumb propertyId={String(propertyId)} />

      {/* Pass wishlist state and toggle function */}
      <ImageCarousel
        images={property.images}
        isSaved={isSaved}
        onToggleSaved={toggleWishlist}
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
          onReserve={handleReserveWithRentRequest}
          onBuy={() => {}} // Add your buy handler here
          onCancel={() => {}} // Add your cancel handler here
          hasActivePurchase={false} // Add your active purchase logic here
          rentRequestLoading={rentRequestLoading}
          errorMessages={errorMessage}
          unavailableDates={unavailableDates} // ✅ Pass the unavailable dates
        />
      </div>
    </div>
  );
}

export default PropertyListing;