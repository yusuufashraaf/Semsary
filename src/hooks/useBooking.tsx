import { useState } from "react";
import { Property } from "src/types";
import { validateBooking } from "@validations/bookingValidation";

/**
 * Custom hook to manage booking state and logic.
 */
export const useBooking = (property: Property | null) => {
  // State
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");
  const [loading, setLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>({});

  // Derived values
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const subtotal = property ? property.price * nights : 0;
  const total = subtotal;

  // Actions
  const handleReserve = async (propertyId: string) => {
    if (!property) return;

    // Use centralized validation
    const validationErrors = validateBooking({
      checkIn,
      checkOut,
      guests,
      isSell: property.status === "sell",
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Fake API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        `Reservation Confirmed!\nProperty ID: ${propertyId}\nNights: ${nights}\nTotal: $${total}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Exposed values
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
    errors,
    handleReserve,
  };
};
