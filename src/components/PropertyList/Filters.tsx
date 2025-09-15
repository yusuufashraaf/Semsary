import { memo, useCallback } from "react";
import { FiltersProps } from "src/types";
import { Slider, Box, Typography } from "@mui/material";
import styles from "./Filters.module.css";
import { formatCurrency } from "@utils/HelperFunctions";
function Filters({
  location,
  setLocation,
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  status,
  setStatus,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  amenities,
  setAmenities,
  clearAllFilters,
  locations = [],
  propertyTypes = [],
  bedroomsOptions = [],
  statuses = [],
  amenitiesOptions = [],
  itemsPerPage,
  setItemsPerPage,
  minPrice,
  maxPrice,
}: FiltersProps) {
  // Memoized handler for amenity checkbox toggle
  const handleAmenityChange = useCallback(
    (amenity: string) => {
      setAmenities(
        amenities.includes(amenity)
          ? amenities.filter((a) => a !== amenity)
          : [...amenities, amenity]
      );
    },
    [amenities, setAmenities]
  );

  return (
    <div className={`${styles.filtersSidebar} ${styles.show}`}>
      {/* Header: Filters title and Clear All button */}
      <div className={styles.filtersHeader}>
        <h3 className={styles.filtersTitle}>Filters</h3>
        <button className={styles.clearFiltersBtn} onClick={clearAllFilters}>
          Clear All
        </button>
      </div>

      {/* Items Per Page selector */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Items per page</label>
        <div className={styles.customSelectWrapper}>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className={styles.customSelect}
          >
            {[12, 24, 36, 48].map((num) => (
              <option key={num} value={num}>
                {num} posts
              </option>
            ))}
          </select>
          <span className={styles.selectArrow}>▼</span>
        </div>
      </div>

      {/* Location selector */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Location</label>
        <div className={styles.customSelectWrapper}>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={styles.customSelect}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc.charAt(0).toUpperCase() + loc.slice(1)}
              </option>
            ))}
          </select>
          <span className={styles.selectArrow}>▼</span>
        </div>
      </div>

      {/* Property Type selector */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Property Type</label>
        <div className={styles.customSelectWrapper}>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={styles.customSelect}
          >
            <option value="">All Types</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <span className={styles.selectArrow}>▼</span>
        </div>
      </div>

      {/* Bedrooms selector */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Bedrooms</label>
        <div className={styles.customSelectWrapper}>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className={styles.customSelect}
          >
            <option value="">Any</option>
            {bedroomsOptions.map((b) => (
              <option key={b} value={b}>
                {b === "0" ? "Studio" : b + " Bedrooms"}
              </option>
            ))}
          </select>
          <span className={styles.selectArrow}>▼</span>
        </div>
      </div>

      {/* Status selector */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Status</label>
        <div className={styles.customSelectWrapper}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.customSelect}
          >
            <option value="">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <span className={styles.selectArrow}>▼</span>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Price Range</label>
        <Box sx={{ px: 2, mt: 1 }}>
          <Typography variant="body2" className={styles.currency}>
            {formatCurrency(priceMin)} - {formatCurrency(priceMax)}
          </Typography>
          <Slider
            value={[priceMin, priceMax]}
            onChange={(_, newValue) => {
              const [min, max] = newValue as number[];
              setPriceMin(min);
              setPriceMax(max);
            }}
            valueLabelDisplay="auto"
            min={minPrice}
            max={maxPrice}
            step={1}
            disableSwap
            className={styles.slider}
          />
        </Box>
      </div>

      {/* Amenities checkboxes */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Amenities</label>
        <div className={styles.checkboxGroup}>
          {amenitiesOptions.map((a) => (
            <label key={a} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={amenities.includes(a)}
                onChange={() => handleAmenityChange(a)}
              />
              <span className={styles.checkboxCustom}></span>
              <span className={styles.checkboxLabel}>
                {a.charAt(0).toUpperCase() + a.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// Exporting memoized component for performance optimization
export default memo(Filters);
