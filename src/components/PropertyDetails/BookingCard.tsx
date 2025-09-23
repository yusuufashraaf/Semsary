import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./BookingCard.module.css";
import { formatCurrency } from "@utils/HelperFunctions";
import { Property, GuestOption } from "src/types";

interface BookingCardProps {
  property: Property;
  booking: {
    checkIn: string;
    setCheckIn: (value: string) => void;
    checkOut: string;
    setCheckOut: (value: string) => void;
    guests: string;
    setGuests: (value: string) => void;
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
  loading: boolean;
  errorMessage: string;
  unavailableDates: Date[];
  owner: any;
  activePurchase?: any;
  purchaseCheckCompleted: boolean;
}

function BookingCard({
  property,
  booking,
  guestOptions,
  onReserve,
  onBuy,
  onCancel,
  hasActivePurchase,
  loading,
  errorMessage,
  unavailableDates,
  owner,
  activePurchase,
  purchaseCheckCompleted
}: BookingCardProps) {
  const today = new Date();
  const isSell = property.price_type === "FullPay";
  const isRentFormValid =
    booking.checkIn && booking.checkOut && booking.guests && booking.nights > 0;

  // Check if we should show the buy button
  const shouldShowBuyButton = () => {
    return isSell && !hasActivePurchase && property.status === "Valid";
  };

  // Check if we should show cancel button (pending or paid status)
  const shouldShowCancelButton = () => {
    if (!hasActivePurchase || !activePurchase) return false;
    return ['pending', 'paid'].includes(activePurchase.status);
  };

  // Check if we should show owner info (only for buy properties with pending/paid status)
  const shouldShowOwnerInfo = () => {
    if (!isSell || !hasActivePurchase || !activePurchase || !owner) return false;
    return ['pending', 'paid'].includes(activePurchase.status);
  };

  // Get status display message
  const getStatusMessage = () => {
    if (!hasActivePurchase || !activePurchase) return null;
    
    const statusMessages = {
      'pending': 'Purchase Pending',
      'paid': 'Purchase Paid',
      'confirmed': 'Purchase Confirmed',
      'completed': 'Purchase Completed',
      'rejected': 'Purchase Rejected',
      'refunded': 'Purchase Refunded',
      'cancelled': 'Purchase Cancelled'
    };

    return statusMessages[activePurchase.status as keyof typeof statusMessages] || `Status: ${activePurchase.status}`;
  };


  return (
    <div className="col-lg-4">
      <div className={styles.bookingCard}>
        {/* Owner info - Only show for buy properties with pending/paid purchase */}
        {shouldShowOwnerInfo() && (
          <div className={styles.ownerInfo}>
            <h5>Property Owner</h5>
            <p>
              {owner.first_name && owner.last_name 
                ? `${owner.first_name} ${owner.last_name}` 
                : owner.name || 'Owner Information Available'
              }
            </p>
            <div>
            {owner.email && (
              <small>Email: {owner.email}</small>
              
              )}
              </div>
               {owner.phone && (
              <small>Phone: {owner.phone}</small>
              
            )}
          </div>
        )}

        {/* Price */}
        <div className={styles.bookingPrice}>
          {formatCurrency(property.price)}
          {!isSell && <small className={styles.smallMuted}> / night</small>}
        </div>

        {/* Rent form - Only show for rent properties that are valid */}
        {!isSell && property.status === "Valid" && (
          <>
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label">Check-in</label>
                <DatePicker
                  selected={
                    booking.checkIn ? new Date(booking.checkIn) : new Date()
                  }
                  onChange={(date) =>
                    booking.setCheckIn(
                      date ? date.toISOString().split("T")[0] : ""
                    )
                  }
                  minDate={today}
                  excludeDates={unavailableDates}
                  dayClassName={(date) =>
                    unavailableDates.some(
                      (d) => d.toDateString() === date.toDateString()
                    )
                      ? styles.lockedDay
                      : ""
                  }
                  className={`${styles.date} form-control`}
                  disabled={loading}
                  placeholderText="Select check-in date"
                />
              </div>
              <div className="col-6">
                <label className="form-label">Check-out</label>
                <DatePicker
                  selected={
                    booking.checkOut ? new Date(booking.checkOut) : undefined
                  }
                  onChange={(date) =>
                    booking.setCheckOut(
                      date ? date.toISOString().split("T")[0] : ""
                    )
                  }
                  minDate={booking.checkIn ? new Date(booking.checkIn) : today}
                  excludeDates={unavailableDates}
                  dayClassName={(date) =>
                    unavailableDates.some(
                      (d) => d.toDateString() === date.toDateString()
                    )
                      ? styles.lockedDay
                      : ""
                  }
                  className={`${styles.date} form-control`}
                  disabled={loading}
                  placeholderText="Select check-out date"
                />
              </div>
            </div>

            {/* Guests */}
            <div className={styles.guestSelect}>
              <label className={styles.formLabel}>Guests</label>
              <select
                className={styles.formInput}
                value={booking.guests}
                onChange={(e) => booking.setGuests(e.target.value)}
                disabled={loading}
              >
                <option value="">Select guests</option>
                {guestOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Error message */}
        {errorMessage && !loading && (
          <div className={styles.validationMsg}>{errorMessage}</div>
        )}

        {/* Button Logic */}
        {isSell ? (
          // For FullPay properties (Buy/Sell)
          <div className={styles.buttonSection}>
            {/* Show Buy Now button if property is valid and no active purchase */}
            {shouldShowBuyButton() && (
              <button
                type="button"
                className={styles.reserveBtn}
                onClick={onBuy}
                disabled={loading}
              >
                {loading ? <span className={styles.spinner}></span> : "Buy Now"}
              </button>
            )}
            
            {/* Show Cancel button if purchase status is pending or paid */}
            {shouldShowCancelButton() && (
              <button
                type="button"
                className={`${styles.cancelBtn || styles.reserveBtn} ${styles.cancelButton}`}
                onClick={onCancel}
                disabled={loading}
              >
                {loading ? <span className={styles.spinner}></span> : "Cancel Purchase"}
              </button>
            )}
            
            {/* Show property not available message */}
            {!hasActivePurchase && property.status !== "Valid" && (
              <div className={styles.unavailableMsg}>
                <p>
                  {property.status === "Invalid" 
                    ? "This property has already been sold."
                    : "This property is not available for purchase."}
                </p>
              </div>
            )}

            {/* Show purchase status for existing purchases */}
            {hasActivePurchase && activePurchase && (
              <div className={styles.purchaseStatus}>
                <div className={styles.statusHeader}>
                  <strong>{getStatusMessage()}</strong>
                </div>
                
                {/* Show cancellation deadline if applicable */}
                {shouldShowCancelButton() && activePurchase.cancellation_deadline && (
                  <small className={styles.deadlineInfo}>
                    Cancellation deadline: {new Date(activePurchase.cancellation_deadline).toLocaleString()}
                  </small>
                )}
                
                {/* Additional status info */}
                {activePurchase.status === 'confirmed' && (
                  <small>Property ownership confirmed</small>
                )}
                {activePurchase.status === 'completed' && (
                  <small>Transaction finalized</small>
                )}
                {activePurchase.status === 'rejected' && (
                  <small>Purchase was not approved</small>
                )}
                {activePurchase.status === 'refunded' && (
                  <small>Purchase amount refunded</small>
                )}
              </div>
            )}
          </div>
        ) : (
          // For Rent properties
          <div className={styles.buttonSection}>
            {property.status === "Valid" ? (
              <button
                type="button"
                className={styles.reserveBtn}
                onClick={onReserve}
                disabled={loading || !isRentFormValid}
                title={!isRentFormValid ? "Please fill in all booking details" : ""}
              >
                {loading ? <span className={styles.spinner}></span> : "Submit Rent Request"}
              </button>
            ) : (
              <div className={styles.unavailableMsg}>
                <p>This property is not available for booking.</p>
              </div>
            )}
          </div>
        )}

        {/* Price breakdown for rent - Only show if not sell and has valid dates */}
        {!isSell && booking.nights > 0 && (
          <div className={styles.priceBreakdown}>
            <div className={styles.breakdownRow}>
              <span>
                {formatCurrency(property.price)} × {booking.nights}{" "}
                {booking.nights === 1 ? "night" : "nights"}
              </span>
              <span>{formatCurrency(booking.subtotal)}</span>
            </div>

            <div className={styles.breakdownRow}>
              <span>Security deposit</span>
              <span>{formatCurrency(booking.subtotal)}</span>
            </div>

            <div className={styles.breakdownRow}>
              <strong>Total</strong>
              <strong>{formatCurrency(booking.total * 2)}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingCard;