/**
 * validateBooking
 *
 * Validates booking form data (check-in, check-out, guests).
 * - Ensures check-in and check-out dates are provided (if not a sale property)
 * - Prevents selecting past dates
 * - Enforces check-out date to be after check-in
 * - Requires guests selection
 *
 */
export const validateBooking = ({
  checkIn,
  checkOut,
  guests,
  isSell,
}: {
  checkIn: string;
  checkOut: string;
  guests: string;
  isSell: boolean;
}): { checkIn?: string; checkOut?: string; guests?: string } => {
  const today = new Date().toISOString().split("T")[0];
  const errors: { checkIn?: string; checkOut?: string; guests?: string } = {};

  // Validation applies only if property is for booking, not selling
  if (!isSell) {
    // Check-in required
    if (!checkIn) errors.checkIn = "Please select a check-in date.";

    // Check-out required
    if (!checkOut) errors.checkOut = "Please select a check-out date.";

    // Prevent check-in in the past
    if (checkIn && new Date(checkIn) < new Date(today))
      errors.checkIn = "Check-in date cannot be in the past.";

    // Check-out must be after check-in
    if (checkOut && new Date(checkOut) <= new Date(checkIn))
      errors.checkOut = "Check-out date must be after check-in.";

    // Guests required
    if (!guests) errors.guests = "Please select the number of guests.";
  }

  return errors;
};
