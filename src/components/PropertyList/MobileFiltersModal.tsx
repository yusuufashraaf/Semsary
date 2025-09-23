import React, { useCallback, useEffect } from "react";
import Filters from "./Filters";
import styles from "./MobileFiltersModal.module.css";
import { MobileFiltersModalProps, FilterState } from "src/types";

/** Mobile Filters Modal Component */
const MobileFiltersModal: React.FC<MobileFiltersModalProps> = ({
  isOpen,
  onClose,
  tempFilters,
  setTempFilters,
  clearTempFilters,
  applyFilters,
  filterOptions,
  itemsPerPage,
  setItemsPerPage,
}) => {
  /** Return null if modal is closed */
  if (!isOpen) return null;

  /** Generic updater for filters */
  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setTempFilters((prev: FilterState) => ({ ...prev, [key]: value }));
    },
    [setTempFilters]
  );

  /** Close modal on Escape key */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    /** Modal Backdrop */
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filters-title"
    >
      <div className="modal-dialog modal-fullscreen-sm-down modal-dialog-centered">
        <div className={`modal-content ${styles.modalContent}`}>
          {/* Header */}
          <div className={`modal-header ${styles.modalHeader}`}>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close filters"
              onClick={onClose}
            />
          </div>
          {/* Body */}
          <div className={`modal-body ${styles.modalBody}`}>
            <form className="w-100">
              <div className="d-flex justify-content-center w-100">
<Filters
  location={tempFilters.location}
  setLocation={(val) => updateFilter("location", val)}
  propertyType={tempFilters.propertyType}
  setPropertyType={(val) => updateFilter("propertyType", val)}
  bedrooms={tempFilters.bedrooms}
  setBedrooms={(val) => updateFilter("bedrooms", val)}
  status={tempFilters.status}
  setStatus={(val) => updateFilter("status", val)}
  priceMin={tempFilters.priceMin}
  setPriceMin={(val) => updateFilter("priceMin", val)}
  priceMax={tempFilters.priceMax}
  setPriceMax={(val) => updateFilter("priceMax", val)}
  /** ✅ missing priceType props */
  priceType={tempFilters.priceType}
  setPriceType={(val) => updateFilter("priceType", val)}
  minPrice={filterOptions.minPrice}
  maxPrice={filterOptions.maxPrice}
  amenities={tempFilters.amenities}
  setAmenities={(val) => updateFilter("amenities", val)}
  clearAllFilters={clearTempFilters}
  itemsPerPage={itemsPerPage}
  setItemsPerPage={setItemsPerPage}
  locations={filterOptions.locations}
  propertyTypes={filterOptions.propertyTypes}
  bedroomsOptions={filterOptions.bedroomsOptions}
  statuses={filterOptions.statuses}
  amenitiesOptions={filterOptions.amenitiesOptions}
  sortBy={tempFilters.sortBy}
  setSortBy={(val) => updateFilter("sortBy", val)}
  sortOrder={tempFilters.sortOrder}
  setSortOrder={(val) => updateFilter("sortOrder", val)}
/>
              </div>
            </form>
          </div>
          {/* Footer */}
          <div className={`modal-footer mt-3 ${styles.modalFooter}`}>
            <button
              type="button"
              className={`${styles.closeButton} me-3`}
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className={styles.applyButton}
              onClick={() => {
                applyFilters();
                onClose();
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Export memoized component */
export default React.memo(MobileFiltersModal);
