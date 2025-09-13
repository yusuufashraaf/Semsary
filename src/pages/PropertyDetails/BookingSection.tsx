import BookingCard from "@components/PropertyDetails/BookingCard";
import { BookingSectionProps } from "src/types";

/**
 * BookingSection
 *
 * A wrapper around BookingCard that passes booking data and handlers.
 * - Handles guest selection, dates, and reservation submission
 * - Calculates nights, subtotal, and total
 */
function BookingSection({
  property,
  booking,
  guestOptions,
}: BookingSectionProps) {
  return (
    <BookingCard
      // Price & Sale/Rent
      price={property.price}
      isSell={property.status === "sell"}
      // Booking details (check-in/out and guests)
      checkIn={booking.checkIn}
      setCheckIn={booking.setCheckIn}
      checkOut={booking.checkOut}
      setCheckOut={booking.setCheckOut}
      guests={booking.guests}
      setGuests={booking.setGuests}
      guestOptions={guestOptions}
      // Reserve button handler
      onReserve={() => booking.handleReserve(property.id)}
      // Loading and error handling
      loading={booking.loading}
      errorMessage={
        booking.errors.checkIn ||
        booking.errors.checkOut ||
        booking.errors.guests
      }
      // Booking summary
      nights={booking.nights}
      subtotal={booking.subtotal}
      total={booking.total}
    />
  );
}

export default BookingSection;
