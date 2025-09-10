import React, { useMemo, useCallback } from "react";
import styles from "./Pagination.module.css";
import { PaginationProps } from "src/types";

type PageItem = number | "start-ellipsis" | "end-ellipsis";

const Pagination: React.FC<
  PaginationProps & {
    prevLabel?: string;
    nextLabel?: string;
    maxVisiblePages?: number;
  }
> = ({
  currentPage,
  totalPages,
  onPageChange,
  scrollToTop,
  prevLabel = "Prev",
  nextLabel = "Next",
  maxVisiblePages = 5,
}) => {
  /* Generate page numbers with dynamic ellipsis */
  const pages: PageItem[] = useMemo(() => {
    const items: PageItem[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);

      items.push(1);

      if (left > 2) items.push("start-ellipsis");

      for (let i = left; i <= right; i++) items.push(i);

      if (right < totalPages - 1) items.push("end-ellipsis");

      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages, maxVisiblePages]);

  /* Handle page change safely */
  const handleChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return;
      onPageChange(page);
      scrollToTop();
    },
    [currentPage, totalPages, onPageChange, scrollToTop]
  );

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      {/* Previous button */}
      <button
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        {prevLabel}
      </button>

      {/* Page numbers */}
      {pages.map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={p}
            className={currentPage === p ? styles.active : ""}
            onClick={() => handleChange(p)}
            aria-current={currentPage === p ? "page" : undefined}
            aria-label={`Go to page ${p}`}
          >
            {p}
          </button>
        ) : (
          <span key={p + idx} className={styles.ellipsis} aria-hidden="true">
            &hellip;
          </span>
        )
      )}

      {/* Next button */}
      <button
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        {nextLabel}
      </button>
    </nav>
  );
};

export default React.memo(Pagination);
