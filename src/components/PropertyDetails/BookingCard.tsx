import styles from "./BookingCard.module.css";
import { formatCurrency } from "@utils/HelperFunctions";
import { BookingCardProps } from "src/types";
import ErrorMessage from "@components/common/ErrorMessage/ErrorMessage";

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
}: BookingCardProps) {
  const today = new Date().toISOString().split("T")[0];

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
                  className="form-control"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={today}
                />
              </div>
              <div className="col-6">
                <label className="form-label">Check-out</label>
                <input
                  type="date"
                  className="form-control"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || today}
                />
              </div>
            </div>

            <div className={styles.guestSelect}>
              <label className={styles.formLabel}>Guests</label>
              <select
                className={styles.formInput}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                {guestOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Reserve/Buy Button */}
        {isSell ? (
          <button
            type="button"
            className={styles.reserveBtn}
            onClick={() => alert("Buy")}
            disabled={loading}
          >
            {loading ? <span className={styles.spinner}></span> : "Buy Now"}
          </button>
        ) : (
          <button
            type="button"
            className={styles.reserveBtn}
            onClick={onReserve}
            disabled={loading}
          >
            {loading ? <span className={styles.spinner}></span> : "Reserve Now"}
          </button>
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
            <hr className={styles.divider} />
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        )}

        {/* Error */}
        <ErrorMessage message={errorMessage} />
      </div>
    </div>
  );
}

export default BookingCard;
