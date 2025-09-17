import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FiltersProps } from "src/types";
import { Slider, Box, Typography } from "@mui/material";
import styles from "./Filters.module.css";
import { formatCurrency } from "@utils/HelperFunctions";
import debounce from "lodash.debounce";

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
  // ---------------------- Local states for smooth slider ----------------------
  const [localPriceMin, setLocalPriceMin] = useState(priceMin);
  const [localPriceMax, setLocalPriceMax] = useState(priceMax);

  // ✅ Sync local states with props so they don’t get stuck at 0 on reload
  useEffect(() => {
    setLocalPriceMin(priceMin);
    setLocalPriceMax(priceMax);
  }, [priceMin, priceMax]);

  // ---------------------- Debounced handlers ----------------------
  const debouncedSetPrice = useMemo(
    () =>
      debounce((min: number, max: number) => {
        setPriceMin(min);
        setPriceMax(max);
      }, 300),
    [setPriceMin, setPriceMax]
  );

  const debouncedSetItemsPerPage = useMemo(
    () =>
      debounce((num: number) => {
        setItemsPerPage(num);
      }, 300),
    [setItemsPerPage]
  );

  useEffect(() => {
    return () => {
      debouncedSetPrice.cancel();
      debouncedSetItemsPerPage.cancel();
    };
  }, [debouncedSetPrice, debouncedSetItemsPerPage]);

  // ---------------------- Amenity toggle ----------------------
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
      {/* Header */}
      <div className={styles.filtersHeader}>
        <h3 className={styles.filtersTitle}>Filters</h3>
        <button className={styles.clearFiltersBtn} onClick={clearAllFilters}>
          Clear All
        </button>
      </div>

      {/* Items Per Page */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Items per page</label>
        <div className={styles.customSelectWrapper}>
          <select
            value={itemsPerPage}
            onChange={(e) => debouncedSetItemsPerPage(Number(e.target.value))}
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

      {/* Location */}
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

      {/* Property Type */}
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

      {/* Bedrooms */}
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
                {b.toString() === "0"
                  ? "Studio"
                  : b.toString() === "1"
                  ? b + " Bedroom"
                  : b + " bedrooms"}
              </option>
            ))}
          </select>
          <span className={styles.selectArrow}>▼</span>
        </div>
      </div>

      {/* Status */}
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

      {/* Price Range Slider */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Price Range</label>
        <Box sx={{ px: 2, mt: 1 }}>
          <Typography variant="body2" className={styles.currency}>
            {formatCurrency(localPriceMin)} - {formatCurrency(localPriceMax)}
          </Typography>
          <Slider
            value={[localPriceMin, localPriceMax]}
            onChange={(_, newValue) => {
              const [min, max] = newValue as number[];
              setLocalPriceMin(min);
              setLocalPriceMax(max);
              debouncedSetPrice(min, max);
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

      {/* Amenities */}
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

export default memo(Filters);
