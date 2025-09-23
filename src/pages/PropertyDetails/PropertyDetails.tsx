import { useEffect, useMemo, useState } from "react";
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
import { usePropertyPurchases } from "@hooks/usePropertyPurchases";

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

  // Get current user and JWT from Redux
  const user = useSelector((state: RootState) => state.Authslice.user);
  const { jwt } = useSelector((state: RootState) => state.Authslice);

  // State for unavailable dates
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [purchaseCheckCompleted, setPurchaseCheckCompleted] = useState(false);

  // Use the updated property purchases hook
  const {
    activePurchase,
    hasActivePurchase,
    loading: purchaseLoading,
    error: purchaseError,
    pay,
    cancel,
    fetchPurchaseForProperty,
    clearError
  } = usePropertyPurchases();

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

  // Fetch purchase data for this property when component mounts or propertyId changes
  useEffect(() => {
    const checkPurchaseForProperty = async () => {
      if (!propertyId || !jwt || !user) {
        setPurchaseCheckCompleted(true);
        return;
      }

      try {
        console.log("Fetching purchase data for property:", propertyId);
        await fetchPurchaseForProperty(propertyId);
      } catch (error) {
        console.error("Error checking purchase for property:", error);
      } finally {
        setPurchaseCheckCompleted(true);
      }
    };

    checkPurchaseForProperty();
  }, [propertyId, jwt, user, fetchPurchaseForProperty]);

  // Fetch unavailable dates
  useEffect(() => {
    const fetchUnavailableDates = async () => {
      if (propertyId) {
        try {
          const dates = await getUnavailableDates(
            propertyId,
            jwt ?? undefined
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
          setUnavailableDates([]);
        }
      }
    };

    fetchUnavailableDates();
  }, [propertyId, jwt]);

  // Set today as default check-in date
  useEffect(() => {
    if (!booking.checkIn && property && property.price_type === "Rent") {
      booking.setCheckIn(new Date().toISOString().split("T")[0]);
    }
  }, [booking.checkIn, booking.setCheckIn, property]);

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

  // Handle buy functionality
  const handleBuy = async () => {
    if (!user) {
      toast.error("Please login to make a purchase");
      return;
    }

    if (!property) {
      toast.error("Property information is not available");
      return;
    }

    // Clear any previous errors
    clearError();
    
    try {
      const purchasePayload = {
        expected_total: property.price,
        idempotency_key: `${property.id}-${user.id}-${Date.now()}`,
      };

      console.log("Making purchase request:", purchasePayload);
      const result = await pay(Number(property.id), purchasePayload);
      
      console.log("Purchase result:", result);
      
      if (result?.success) {
        toast.success("Property purchased successfully!");
        
        // Refetch property details to get updated status
        refetch();
        
      } else {
        toast.error("Purchase failed. Please try again.");
      }
      
    } catch (error: any) {
      console.error("Failed to purchase property:", error);
      const errorMessage = error.response?.data?.message || "Failed to purchase property. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Handle cancel purchase functionality
  const handleCancelPurchase = async () => {
    if (!user) {
      toast.error("Please login to cancel purchase");
      return;
    }

    if (!activePurchase?.id) {
      toast.error("No active purchase found to cancel");
      return;
    }

    // Clear any previous errors
    clearError();

    try {
      const result = await cancel(activePurchase.id);
      
      console.log("Cancel result:", result);
      
      if (result?.success) {
        toast.success("Purchase cancelled successfully!");
        
        // Refetch property details to get updated status
        refetch();
        
      } else {
        toast.error("Failed to cancel purchase. Please try again.");
      }
      
    } catch (error: any) {
      console.error("Failed to cancel purchase:", error);
      const errorMessage = error.response?.data?.message || "Failed to cancel purchase. Please try again.";
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

  // Loading state - Wait for both property and purchase check to complete
  if (loadingPage || !purchaseCheckCompleted) {
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
    booking.errors?.checkIn,
    booking.errors?.checkOut,
    booking.errors?.guests,
    booking.apiError,
    purchaseError, // Include purchase errors
  ].filter(Boolean).join(" ");

  // Normal render
  return (
    <div className={styles.propertyContainer}>
      <BreadCrumb propertyId={String(propertyId)} />

      {/* Pass wishlist state and toggle function */}
      <ImageCarousel
        images={property.images || []} // Provide empty array fallback
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
          owner={listing?.host} // Pass owner data
          booking={booking}
          guestOptions={guestOptions}
          onReserve={handleReserveWithRentRequest}
          onBuy={handleBuy}
          onCancel={handleCancelPurchase}
          hasActivePurchase={hasActivePurchase}
          rentRequestLoading={rentRequestLoading || purchaseLoading}
          errorMessages={errorMessage}
          unavailableDates={unavailableDates}
          activePurchase={activePurchase}
          purchaseCheckCompleted={purchaseCheckCompleted}
        />
      </div>
    </div>
  );
}

export default PropertyListing;