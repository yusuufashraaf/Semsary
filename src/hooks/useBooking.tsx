import { useState, useCallback } from "react";
import { Property } from "src/types";
import { useAppSelector } from "@store/hook";
import { validateBooking } from "@validations/bookingValidation";

/**
 * Custom hook to manage booking state and logic.
 */
export const useBooking = (property: Property | null) => {
  // State for booking inputs and loading
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");
  const [loading, setLoading] = useState<boolean>(false);

  // Errors state to hold validation messages
  const [errors, setErrors] = useState<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>({});

  // API error state
  const [apiError, setApiError] = useState<string | null>(null);

  // Redux hook to get JWT token from the store
  const { jwt } = useAppSelector((state) => state.Authslice);

  // Derived values (calculated fields)
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  const subtotal = property ? property.price * nights : 0;
  const total = subtotal;

  // Clear API error when booking data changes
  const clearApiError = useCallback(() => {
    setApiError(null);
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
    setApiError(null);
  }, []);

  // Validate booking data
  const validateBookingData = useCallback(() => {
    if (!property) return false;

    const validationErrors = validateBooking({
      checkIn,
      checkOut,
      guests,
      isSell: property.status === "Valid",
    });

    // If there are validation errors, update the errors state
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [checkIn, checkOut, guests, property]);

  // Handle the reserve action (validation only - actual API call handled in parent)
  const handleReserve = useCallback(async () => {
    if (!property || !jwt) {
      setApiError("Unable to proceed with reservation");
      return false;
    }

    // Clear previous errors
    setApiError(null);
    
    // Perform validation
    const isValid = validateBookingData();
    
    if (!isValid) {
      return false;
    }

    // Return true if validation passes - parent component handles API call
    return true;
  }, [property, jwt, validateBookingData]);

  // Reset booking form
  const resetBooking = useCallback(() => {
    setCheckIn("");
    setCheckOut("");
    setGuests("2");
    setErrors({});
    setApiError(null);
    setLoading(false);
  }, []);

  // Exposed values to be used in the component
  return {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    nights,
    subtotal,
    total,
    loading,
    setLoading,
    errors,
    apiError,
    setApiError,
    handleReserve,
    validateBookingData,
    clearApiError,
    clearErrors,
    resetBooking,
  };
};