import { Dispatch, SetStateAction } from "react";
import BookingCard from "@components/PropertyDetails/BookingCard";
import { Property, GuestOption } from "src/types";

interface BookingSectionProps {
  property: Property;
  booking: {
    checkIn: string;
    setCheckIn: Dispatch<SetStateAction<string>>; // Fixed type
    checkOut: string;
    setCheckOut: Dispatch<SetStateAction<string>>; // Fixed type
    guests: string;
    setGuests: Dispatch<SetStateAction<string>>; // Fixed type
    nights: number;
    subtotal: number;
    total: number;
    loading: boolean;
  };
  guestOptions: GuestOption[];
  onReserve: () => void;
  rentRequestLoading: boolean;
  errorMessages: string;
}

function BookingSection({
  property,
  booking,
  guestOptions,
  onReserve,
  rentRequestLoading,
  errorMessages,
}: BookingSectionProps) {
  return (
    <BookingCard
      price={property.price}
      isSell={property.status === "Sold"}
      checkIn={booking.checkIn}
      setCheckIn={booking.setCheckIn}
      checkOut={booking.checkOut}
      setCheckOut={booking.setCheckOut}
      guests={booking.guests}
      setGuests={booking.setGuests}
      guestOptions={guestOptions}
      onReserve={onReserve}
      loading={rentRequestLoading || booking.loading}
      errorMessage={errorMessages}
      nights={booking.nights}
      subtotal={booking.subtotal}
      total={booking.total}
      property_state={property.status}
    />
  );
}

export default BookingSection;