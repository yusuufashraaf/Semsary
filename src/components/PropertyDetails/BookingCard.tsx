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
  unavailableDates: Date[]; // ✅ added
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
}: BookingCardProps) {
  const today = new Date();
  const isSell = property.price_type === "FullPay";
  const isRentFormValid =
    booking.checkIn && booking.checkOut && booking.guests && booking.nights > 0;

  return (
    <div className="col-lg-4">
      <div className={styles.bookingCard}>
        {/* Price */}
        <div className={styles.bookingPrice}>
          {formatCurrency(property.price)}
          {!isSell && <small className={styles.smallMuted}> / night</small>}
        </div>

        {/* Rent form */}
        {!isSell && property.status === "Valid" && (
          <>
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label">Check-in</label>
                <DatePicker
selected={
  booking.checkOut
    ? new Date(booking.checkOut)
    : new Date(today.getTime() + 24 * 60 * 60 * 1000)
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

        {/* Buttons */}
        {property.status === "Valid" ? (
          isSell ? (
            hasActivePurchase ? (
              <button
                type="button"
                className={styles.reserveBtn}
                onClick={onCancel}
                disabled={loading}
              >
                {loading ? <span className={styles.spinner}></span> : "Cancel Purchase"}
              </button>
            ) : (
              <button
                type="button"
                className={styles.reserveBtn}
                onClick={onBuy}
                disabled={loading}
              >
                {loading ? <span className={styles.spinner}></span> : "Buy Now"}
              </button>
            )
          ) : (
            <button
              type="button"
              className={styles.reserveBtn}
              onClick={onReserve}
              disabled={loading || !isRentFormValid}
              title={!isRentFormValid ? "Please fill in all booking details" : ""}
            >
              {loading ? <span className={styles.spinner}></span> : "Submit Rent Request"}
            </button>
          )
        ) : (
          <p className={styles.disabledMsg}>
            This property is not available for booking.
          </p>
        )}

        {/* Price breakdown for rent */}
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
