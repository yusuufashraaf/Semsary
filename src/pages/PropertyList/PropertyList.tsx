import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";

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
import Loader from "@components/common/Loader/Loader";
import { useAppSelector } from "@store/hook";

export default function PropertyList() {
  // ---------------------- State ----------------------
  const [backendListings, setBackendListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const { user } = useAppSelector(state => state.Authslice);
  
  // URL Sync
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUrlUpdating, setIsUrlUpdating] = useState(false);

  // Helper function to get URL param safely
  const getUrlParam = (key: string, defaultValue: string = ""): string => {
    return searchParams.get(key) || defaultValue;
  };

  const getUrlNumParam = (key: string, defaultValue: number = 0): number => {
    const value = searchParams.get(key);
    return value ? Number(value) : defaultValue;
  };

  // Initialize state from URL params only once
  const initializeFromUrl = useCallback(() => {
    if (isInitialized) return;
    
    const urlFilters = {
      location: getUrlParam("location"),
      propertyType: getUrlParam("type"),
      bedrooms: getUrlParam("beds"),
      status: getUrlParam("status"),
      priceMin: getUrlNumParam("priceMin", 0),
      priceMax: getUrlNumParam("priceMax", 0),
      priceType: getUrlParam("price_type"),
      amenities: getUrlParam("amenities")
        ? getUrlParam("amenities").split(",")
        : [],
      itemsPerPage: getUrlNumParam("itemsPerPage", 12),
      sortBy: getUrlParam("sortBy", "created_at"),
      sortOrder: getUrlParam("sortOrder", "desc"),
    };

    setFilters(urlFilters);
    setTempFilters(urlFilters);
    setSearchTerm(getUrlParam("q"));
    setDebouncedSearch(getUrlParam("q"));
    setCurrentPage(getUrlNumParam("page", 1));
    setItemsPerPage(getUrlNumParam("itemsPerPage", 12));
    setIsInitialized(true);
  }, [searchParams, isInitialized]);

  // Main State - Initialize empty, will be populated from URL
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedProperties, setSavedProperties] = useState<number[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // ---------------------- Filters ----------------------
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    bedrooms: "",
    status: "",
    priceMin: 0,
    priceMax: 0,
    priceType: "",
    amenities: [] as string[],
    itemsPerPage: 12,
    sortBy: "created_at",
    sortOrder: "desc",
  });

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

  // Initialize from URL and filter data
  useEffect(() => {
    if (filterData && !isInitialized) {
      initializeFromUrl();
    }
  }, [filterData, initializeFromUrl, isInitialized]);

  // Update price range from backend data once
  useEffect(() => {
    if (filterData && isInitialized && filters.priceMax === 0) {
      setFilters((prev) => ({
        ...prev,
        priceMin: prev.priceMin || filterData.minPrice,
        priceMax: prev.priceMax || filterData.maxPrice,
      }));
    }
  }, [filterData, isInitialized, filters.priceMax]);

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
    if (!isInitialized) return;
    
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
        price_type: filters.priceType,
        amenities: filters.amenities,
        page: currentPage,
        per_page: itemsPerPage,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        user_id: user?.id,
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
  }, [debouncedSearch, filters, currentPage, itemsPerPage, isInitialized, user?.id]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // ---------------------- Reset page when filters change ----------------------
  useEffect(() => {
    if (isInitialized && !isUrlUpdating) {
      setCurrentPage(1);
    }
  }, [filters, debouncedSearch, isInitialized, isUrlUpdating]);

  // ---------------------- Helpers ----------------------
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  // ---------------------- Wishlist ----------------------
  const toggleSavedProperty = (id: number) => {
    setSavedProperties((prev) => {
      const isSaved = prev.includes(id);
      const updated = isSaved ? prev.filter((i) => i !== id) : [...prev, id];

      // Toast feedback
      if (isSaved) toast.info("Removed from wishlist");
      else toast.success("Added to wishlist");

      return updated;
    });
  };

  // ---------------------- Filters helpers ----------------------
  const clearFilters = () => {
    const clearedFilters = {
      location: "",
      propertyType: "",
      bedrooms: "",
      status: "",
      priceMin: filterOptions.minPrice,
      priceMax: filterOptions.maxPrice,
      priceType: "",
      amenities: [],
      itemsPerPage: 12,
      sortBy: "created_at",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setItemsPerPage(12);
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
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

  // Improved URL synchronization with debounce and flag
  const updateUrlParams = useCallback(() => {
    if (!isInitialized || isUrlUpdating) return;
    
    setIsUrlUpdating(true);
    
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      const params = new URLSearchParams();

      // Add search term
      if (debouncedSearch.trim()) {
        params.set("q", debouncedSearch.trim());
      }

      // Add filters
      Object.entries({
        location: filters.location,
        type: filters.propertyType,
        beds: filters.bedrooms,
        status: filters.status,
        price_type: filters.priceType,
      }).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      if (filters.priceMin > 0) {
        params.set("priceMin", filters.priceMin.toString());
      }

      if (filters.priceMax > 0 && filters.priceMax < filterOptions.maxPrice) {
        params.set("priceMax", filters.priceMax.toString());
      }

      if (filters.amenities.length > 0) {
        params.set("amenities", filters.amenities.join(","));
      }

      if (itemsPerPage !== 12) {
        params.set("itemsPerPage", itemsPerPage.toString());
      }

      if (currentPage !== 1) {
        params.set("page", currentPage.toString());
      }

      if (filters.sortBy && filters.sortBy !== "created_at") {
        params.set("sortBy", filters.sortBy);
      }

      if (filters.sortOrder && filters.sortOrder !== "desc") {
        params.set("sortOrder", filters.sortOrder);
      }

      // Only update URL if params have actually changed
      const newParamsString = params.toString();
      const currentParamsString = searchParams.toString();

      if (newParamsString !== currentParamsString) {
        setSearchParams(params, { replace: true });
      }
      
      setIsUrlUpdating(false);
    }, 100);
  }, [
    debouncedSearch,
    filters,
    currentPage,
    itemsPerPage,
    searchParams,
    setSearchParams,
    filterOptions.maxPrice,
    isInitialized,
    isUrlUpdating,
  ]);

  // Debounce URL updates to prevent rapid changes
  const debouncedUrlUpdate = useMemo(
    () => debounce(updateUrlParams, 500),
    [updateUrlParams]
  );

  // Sync state to URL whenever relevant state changes
  useEffect(() => {
    if (isInitialized && !isUrlUpdating) {
      debouncedUrlUpdate();
    }
    
    return () => {
      debouncedUrlUpdate.cancel();
    };
  }, [debouncedSearch, filters, currentPage, itemsPerPage, debouncedUrlUpdate, isInitialized, isUrlUpdating]);

  // ---------------------- Render ----------------------
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-xxl-3 col-xl-3 col-lg-4 d-none d-lg-block">
          <div className="sticky-top" style={{ top: "20px" }}>
            {filtersLoading ? (
              <Loader message="Loading filters..." />
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
                priceType={filters.priceType}
                setPriceType={(val) =>
                  setFilters((prev) => ({ ...prev, priceType: val }))
                }
                amenities={filters.amenities}
                setAmenities={(val) =>
                  setFilters((prev) => ({ ...prev, amenities: val }))
                }
                sortBy={filters.sortBy}
                setSortBy={(val) =>
                  setFilters((prev) => ({ ...prev, sortBy: val }))
                }
                sortOrder={filters.sortOrder}
                setSortOrder={(val) =>
                  setFilters((prev) => ({ ...prev, sortOrder: val }))
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

        {/* Main Content */}
        <div className="col-xxl-9 col-xl-9 col-lg-8 col-12">
          {/* Mobile Filter Button */}
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

          {/* Mobile Filters Modal */}
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
            sortOrder={filters.sortOrder}
            sortBy={filters.sortBy}
          />

          <div className={styles.propertyListContainer}>
            {/* Search */}
            <div className="mb-3">
              <Search
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
              />
            </div>

            {/* Active Filter Badges */}
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

            {error && <ErrorMessage message={error} />}

            <ViewToggle
              viewMode={viewMode}
              setViewMode={setViewMode}
              resultsCount={totalResults}
              shownCount={backendListings.length}
            />

            {/* Property Cards */}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                scrollToTop={scrollToTop}
              />
            )}

            {/* Scroll to Top */}
            <ScrollTopButton />
          </div>
        </div>
      </div>
    </div>
  );
}