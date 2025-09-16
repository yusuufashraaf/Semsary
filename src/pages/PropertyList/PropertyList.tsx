import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";

import Search from "../../components/PropertyList/Search";
import Filters from "../../components/PropertyList/Filters";
import PropertyCard from "@components/PropertyList/PropertCard";
import ViewToggle from "@components/PropertyList/ViewToggle";
import Pagination from "@components/PropertyList/Pagination";
import ScrollTopButton from "@components/PropertyList/ScrollToTop";
import MobileFiltersModal from "@components/PropertyList/MobileFiltersModal";

import { Listing } from "src/types";
import styles from "./PropertyList.module.css";
import { formatActiveFilters } from "@utils/HelperFunctions";
import { useFilterOptions } from "@hooks/useFilterOptions";
import { getProperties } from "@services/PropertyListServices";
import ErrorMessage from "@components/common/ErrorMessage/ErrorMessage";

export default function PropertyList() {
  // ---------------------- State ----------------------
  const [backendListings, setBackendListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // URL Sync
  const [searchParams, setSearchParams] = useSearchParams();

  // Main State
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedProperties, setSavedProperties] = useState<number[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(
    Number(searchParams.get("itemsPerPage")) || 12
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  // Initial Filter State
  const initialFilterState = {
    location: searchParams.get("location") || "",
    propertyType: searchParams.get("type") || "",
    bedrooms: searchParams.get("beds") || "",
    status: searchParams.get("status") || "",
    priceMin: Number(searchParams.get("priceMin")) || 0,
    priceMax: Number(searchParams.get("priceMax")) || 0,
    amenities: searchParams.get("amenities")?.split(",") || [],
    itemsPerPage: Number(searchParams.get("itemsPerPage")) || 12,
  };

  const [filters, setFilters] = useState(initialFilterState);
  const [tempFilters, setTempFilters] = useState({ ...filters });

  const {
    data: filterData,
    loading: filtersLoading,
    error: filtersError,
  } = useFilterOptions();

  const filterOptions = filterData || {
    locations: [],
    propertyTypes: [],
    bedroomsOptions: [],
    statuses: [],
    amenitiesOptions: [],
    minPrice: 0,
    maxPrice: 700000,
  };

  useEffect(() => {
    if (filterData) {
      setFilters((prev) => ({
        ...prev,
        priceMin: filterData.minPrice,
        priceMax: filterData.maxPrice,
      }));
    }
  }, [filterData]);

  // Debounced Search
  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    debouncedUpdate(value);
  };

  // ---------------------- Fetch Backend ----------------------
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getProperties({
        search: debouncedSearch,
        location: filters.location,
        type: filters.propertyType,
        beds: filters.bedrooms,
        status: filters.status,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        amenities: filters.amenities,
        page: currentPage,
        per_page: itemsPerPage,
      });

      if (!data?.data) throw new Error("Invalid response from backend");

      setBackendListings(data.data);
      setTotalPages(data.last_page || 1);
      setTotalResults(data.total || 0);
    } catch (err: any) {
      console.error("Error fetching properties", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to fetch properties."
      );
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, filters, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // ---------------------- Reset page when filters change ----------------------
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // ---------------------- Helpers ----------------------
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  // Toggle Saved Properties
  const toggleSavedProperty = (id: number) => {
    setSavedProperties((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Clear / Apply Filters
  const clearFilters = () => {
    setFilters({
      location: "",
      propertyType: "",
      bedrooms: "",
      status: "",
      priceMin: filterOptions.minPrice,
      priceMax: filterOptions.maxPrice,
      amenities: [],
      itemsPerPage: 12,
    });
    setItemsPerPage(12);
  };
  const clearTempFilters = () => setTempFilters({ ...filters });
  const initializeTempFilters = () => setTempFilters({ ...filters });
  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setShowMobileFilters(false);
  };

  // Active Filter Badges
  const activeFilters = useMemo(
    () => formatActiveFilters(filters, setFilters),
    [filters]
  );

  // Sync state to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch.trim()) params.q = debouncedSearch;
    if (filters.location) params.location = filters.location;
    if (filters.propertyType) params.type = filters.propertyType;
    if (filters.bedrooms) params.beds = filters.bedrooms;
    if (filters.status) params.status = filters.status;
    if (filters.priceMin > 0) params.priceMin = filters.priceMin.toString();
    if (filters.priceMax < filterOptions.maxPrice)
      params.priceMax = filters.priceMax.toString();
    if (filters.amenities.length)
      params.amenities = filters.amenities.join(",");
    if (itemsPerPage !== 12) params.itemsPerPage = itemsPerPage.toString();
    params.page = currentPage.toString();

    const currentParams = Object.fromEntries(searchParams.entries());
    if (JSON.stringify(currentParams) !== JSON.stringify(params)) {
      setSearchParams(params, { replace: true });
    }
  }, [
    debouncedSearch,
    filters,
    currentPage,
    itemsPerPage,
    searchParams,
    setSearchParams,
    filterOptions.maxPrice,
  ]);

  // Render
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-xxl-3 col-xl-3 col-lg-4 d-none d-lg-block">
          <div className="sticky-top" style={{ top: "20px" }}>
            {filtersLoading ? (
              <p>Loading filters...</p>
            ) : filtersError ? (
              <p className="text-danger">{filtersError}</p>
            ) : (
              <Filters
                location={filters.location}
                setLocation={(val) =>
                  setFilters((prev) => ({ ...prev, location: val }))
                }
                propertyType={filters.propertyType}
                setPropertyType={(val) =>
                  setFilters((prev) => ({ ...prev, propertyType: val }))
                }
                bedrooms={filters.bedrooms}
                setBedrooms={(val) =>
                  setFilters((prev) => ({ ...prev, bedrooms: val }))
                }
                status={filters.status}
                setStatus={(val) =>
                  setFilters((prev) => ({ ...prev, status: val }))
                }
                priceMin={filters.priceMin}
                setPriceMin={(val) =>
                  setFilters((prev) => ({ ...prev, priceMin: val }))
                }
                priceMax={filters.priceMax}
                setPriceMax={(val) =>
                  setFilters((prev) => ({ ...prev, priceMax: val }))
                }
                amenities={filters.amenities}
                setAmenities={(val) =>
                  setFilters((prev) => ({ ...prev, amenities: val }))
                }
                clearAllFilters={clearFilters}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                locations={filterOptions.locations}
                propertyTypes={filterOptions.propertyTypes}
                bedroomsOptions={filterOptions.bedroomsOptions}
                statuses={filterOptions.statuses}
                amenitiesOptions={filterOptions.amenitiesOptions}
                minPrice={filterOptions.minPrice}
                maxPrice={filterOptions.maxPrice}
              />
            )}
          </div>
        </div>

        {/*  Main Content */}
        <div className="col-xxl-9 col-xl-9 col-lg-8 col-12">
          {/*  Mobile Filter Button */}
          <div className="d-lg-none mb-3 text-center">
            <button
              className={styles.filterButton}
              onClick={() => {
                initializeTempFilters();
                setShowMobileFilters(true);
              }}
            >
              <i className="bi bi-funnel me-2"></i> Filters
            </button>
          </div>

          {/*  Mobile Filters Modal */}
          <MobileFiltersModal
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            tempFilters={tempFilters}
            setTempFilters={setTempFilters}
            clearTempFilters={clearTempFilters}
            applyFilters={applyFilters}
            filterOptions={filterOptions}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />

          <div className={styles.propertyListContainer}>
            {/*  Search */}
            <div className="mb-3">
              <Search
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
              />
            </div>

            {/*  Active Filter Badges */}
            {activeFilters.length > 0 && (
              <div className="mb-3 d-flex flex-wrap gap-2">
                {activeFilters.map((badge, idx) => (
                  <span
                    key={idx}
                    className="badge bg-danger text-truncate"
                    style={{ cursor: badge.remove ? "pointer" : "default" }}
                    onClick={badge.remove}
                  >
                    {badge.label} {badge.remove && "x"}
                  </span>
                ))}
              </div>
            )}

            {error && <p>{<ErrorMessage message={error} />}</p>}

            <ViewToggle
              viewMode={viewMode}
              setViewMode={setViewMode}
              resultsCount={totalResults}
              shownCount={backendListings.length}
            />

            {/*  Property Cards */}
            <div className="row g-3 g-md-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="col-12 col-sm-6 col-lg-4">
                    <div className={styles.imageLoader}></div>
                  </div>
                ))
              ) : backendListings.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted">
                    <i className="bi bi-house-x display-1"></i>
                    <h4 className={`mt-3 ${styles.noneProperties}`}>
                      No properties found
                    </h4>
                    <p className={`${styles.adjustFilters}`}>
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </div>
              ) : (
                backendListings.map((property) => (
                  <div
                    key={property.id}
                    className={
                      viewMode === "grid"
                        ? "col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-4"
                        : "col-12"
                    }
                  >
                    <PropertyCard
                      property={property}
                      viewMode={viewMode}
                      savedProperties={savedProperties}
                      toggleSavedProperty={toggleSavedProperty}
                    />
                  </div>
                ))
              )}
            </div>

            {/*  Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                scrollToTop={scrollToTop}
              />
            )}

            {/*  Scroll to Top */}
            <ScrollTopButton />
          </div>
        </div>
      </div>
    </div>
  );
}
