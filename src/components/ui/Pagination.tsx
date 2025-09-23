import React from "react";
import { cn } from "@utils/classNames";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems,
  itemsPerPage,
  className,
}) => {
  const pages = React.useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    if (totalPages <= 1) return [1];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {showInfo && totalItems && itemsPerPage && (
        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          Showing{" "}
          <span className="font-semibold">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          of <span className="font-semibold">{totalItems}</span> results
        </div>
      )}

      <nav className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={cn(
            "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200",
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed bg-gray-50"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 bg-white border border-gray-300"
          )}
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pages.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-sm text-gray-500 select-none">...</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handlePageClick(page as number)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 min-w-[40px]",
                    currentPage === page
                      ? "bg-primary-600 text-white shadow-sm border border-primary-600"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 bg-white border border-gray-300"
                  )}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200",
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed bg-gray-50"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 bg-white border border-gray-300"
          )}
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </button>
      </nav>
    </div>
  );
};