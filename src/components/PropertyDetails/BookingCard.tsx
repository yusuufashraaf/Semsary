import styles from "./BookingCard.module.css";
import { formatCurrency } from "@utils/HelperFunctions";
import { BookingCardProps } from "src/types";

function BookingCard({
  price,
  isSell,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  guestOptions,
  onReserve,
  loading,
  errorMessage,
  nights,
  subtotal,
  total,
  property_state
}: BookingCardProps) {
  const today = new Date().toISOString().split("T")[0];

  const isFormValid = !isSell && checkIn && checkOut && guests && nights > 0;


  return (
    <div className="col-lg-4">
      <div className={styles.bookingCard}>
        {/* Price */}
        <div className={styles.bookingPrice}>
          {formatCurrency(price)}
          {!isSell && <small className={styles.smallMuted}> / night</small>}
        </div>

        {/* Check-in/out + Guests */}
        {!isSell && (
          <>
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label">Check-in</label>
                <input
                  type="date"
                  className={`${styles.date} form-control `}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={today}
                  disabled={loading}
                />
              </div>
              <div className="col-6">
                <label className="form-label">Check-out</label>
                <input
                  type="date"
                  className={`${styles.date} form-control`}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || today}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.guestSelect}>
              <label className={styles.formLabel}>Guests</label>
              <select
                className={styles.formInput}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
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

        {/* Display combined error message */}
        {errorMessage && !loading && (
          <div className={styles.validationMsg}>
            {errorMessage}
          </div>
        )}

        {/* Reserve/Cancel Button */}
        {property_state === "Valid" ? (
           (
            isSell ? (
              <button
                type="button"
                className={styles.reserveBtn}
                onClick={onReserve}
                disabled={loading}
              >
                {loading ? <span className={styles.spinner}></span> : "Buy Now"}
              </button>
            ) : (
              <button
                type="button"
                className={styles.reserveBtn}
                onClick={onReserve}
                disabled={loading || !isFormValid}
                title={!isFormValid ? "Please fill in all booking details" : ""}
              >
                {loading ? <span className={styles.spinner}></span> : "Submit Rent Request"}
              </button>
            )
          )
        ) : (
          <p className={styles.disabledMsg}>This property is not available for booking.</p>
        )}

        {/* Price Breakdown */}
        {!isSell && nights > 0 && (
          <div className={styles.priceBreakdown}>
            <div className={styles.breakdownRow}>
              <span>
                {formatCurrency(price)} × {nights}{" "}
                {nights === 1 ? "night" : "nights"}
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className={styles.breakdownRow}>
              <strong>Total</strong>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingCard;