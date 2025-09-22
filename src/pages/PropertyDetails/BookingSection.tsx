import { Dispatch, SetStateAction } from "react";
import BookingCard from "@components/PropertyDetails/BookingCard";
import { Property, GuestOption } from "src/types";

interface BookingSectionProps {
  property: Property;
  booking: {
    checkIn: string;
    setCheckIn: Dispatch<SetStateAction<string>>;
    checkOut: string;
    setCheckOut: Dispatch<SetStateAction<string>>;
    guests: string;
    setGuests: Dispatch<SetStateAction<string>>;
    nights: number;
    subtotal: number;
    total: number;
    loading: boolean;
  };
  guestOptions: GuestOption[];
  onReserve: () => void;
  onBuy: () => void;
  onCancel: () => void;
  hasActivePurchase: boolean;
  rentRequestLoading: boolean;
  errorMessages: string;
  unavailableDates: Date[]; // ✅ added
}

function BookingSection({
  property,
  booking,
  guestOptions,
  onReserve,
  onBuy,
  onCancel,
  hasActivePurchase,
  rentRequestLoading,
  errorMessages,
  unavailableDates,
}: BookingSectionProps) {
  return (
    <BookingCard
      property={property}
      booking={booking}
      guestOptions={guestOptions}
      onReserve={onReserve}
      onBuy={onBuy}
      onCancel={onCancel}
      hasActivePurchase={hasActivePurchase}
      loading={rentRequestLoading || booking.loading}
      errorMessage={errorMessages}
      unavailableDates={unavailableDates} // ✅ pass down
    />
  );
}

export default BookingSection;
