import { useState } from "react";
import styles from "./ReviewItem.module.css";
import { ReviewsListProps } from "src/types";
import Loader from "@components/common/Loader/Loader";
import StarRating from "@components/PropertyDetails/StarRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faLessThan } from "@fortawesome/free-solid-svg-icons";

/* 
  ReviewItem component
  - Lists guest reviews with pagination
  - Shows a loader while fetching new reviews
*/
function ReviewItem({
  reviews,
  reviewsPerPage = 3,
  totalReviews,
  onPageChange,
  loading,
}: ReviewsListProps & { loading: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  // Handle page change for pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  return (
    <section className={styles.reviewsSection}>
      <h3 className={styles.title}>★ Guest Reviews</h3>

      {/* Loader while fetching reviews */}
      {loading ? (
        <Loader message="Loading reviews..." />
      ) : reviews.length === 0 ? (
        <p className={styles.noReviews}>No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <article
            key={r.id}
            className={styles.reviewCard}
            itemScope
            itemType="https://schema.org/Review"
          >
            {/* Avatar (first letter of reviewer’s name) */}
            <div className={styles.avatar} aria-hidden="true">
              {r.reviewer.charAt(0)}
            </div>

            {/* Review Content */}
            <div className={styles.reviewContent}>
              <div className={styles.headerRow}>
                <p className={styles.reviewer} itemProp="author">
                  {r.reviewer}
                </p>
                <StarRating rating={r.rating} />
              </div>
              <p itemProp="reviewBody">{r.review}</p>
              <p className={styles.date} itemProp="datePublished">
                {r.date}
              </p>
            </div>
          </article>
        ))
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <nav className={styles.pagination} aria-label="Reviews Pagination">
          <button
            className={styles.pageBtn}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FontAwesomeIcon icon={faLessThan} />
          </button>
          <span className={styles.pageInfo} aria-current="page">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FontAwesomeIcon icon={faGreaterThan} />
          </button>
        </nav>
      )}
    </section>
  );
}

export default ReviewItem;
