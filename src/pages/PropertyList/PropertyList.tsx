import { useState, useMemo, useEffect } from "react";
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

interface PropertyListProps {
  listings: Listing[];
}

export default function PropertyList({ listings }: PropertyListProps) {
  // /**/ State for backend data
  const [backendListings, setBackendListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // URL Sync
  const [searchParams, setSearchParams] = useSearchParams();

  // Main State
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedProperties, setSavedProperties] = useState<number[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    priceMax: Number(searchParams.get("priceMax")) || 700000,
    amenities: searchParams.get("amenities")?.split(",") || [],
    utilities: searchParams.get("utilities")?.split(",") || [],
    itemsPerPage: Number(searchParams.get("itemsPerPage")) || 12,
  };

  const [filters, setFilters] = useState(initialFilterState);
  const [tempFilters, setTempFilters] = useState({ ...filters });

  // Mock fetch
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setBackendListings(listings);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [listings]);

  // Filter Options
  const uniqueLocations = useMemo(
    () =>
      Array.from(
        new Set(backendListings.map((p) => p.location).filter(Boolean))
      ),
    [backendListings]
  ) as string[];

  const uniquePropertyTypes = useMemo(
    () =>
      Array.from(new Set(backendListings.map((p) => p.type).filter(Boolean))),
    [backendListings]
  ) as string[];

  const uniqueBedrooms = useMemo(
    () =>
      Array.from(
        new Set(backendListings.map((p) => p.beds.toString()).filter(Boolean))
      ).sort(),
    [backendListings]
  ) as string[];

  const uniqueStatuses = useMemo(
    () =>
      Array.from(new Set(backendListings.map((p) => p.status).filter(Boolean))),
    [backendListings]
  ) as string[];

  const uniqueAmenities = useMemo(
    () =>
      Array.from(
        new Set(backendListings.flatMap((p) => p.amenities).filter(Boolean))
      ),
    [backendListings]
  ) as string[];

  const uniqueUtilities = useMemo(
    () =>
      Array.from(
        new Set(backendListings.flatMap((p) => p.utilities).filter(Boolean))
      ),
    [backendListings]
  ) as string[];

  const filterOptions = {
    locations: uniqueLocations,
    propertyTypes: uniquePropertyTypes,
    bedroomsOptions: uniqueBedrooms,
    statuses: uniqueStatuses,
    amenitiesOptions: uniqueAmenities,
    utilitiesOptions: uniqueUtilities,
  };

  // Debounced Search
  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 300),
    []
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value); // update input immediately
    setCurrentPage(1); // reset to first page immediately
    debouncedUpdate(value); // apply debounced filter
  };

  // Filtering Logic
  const filteredListings = useMemo(() => {
    if (isLoading) return [];
    const term = debouncedSearch.trim().toLowerCase();
    return backendListings.filter((property) => {
      const matchesSearch = [
        property.title,
        property.city,
        property.neighborhood,
        property.address,
        property.zip,
      ].some((field) => field?.toString().toLowerCase().includes(term));

      const matchesLocation = filters.location
        ? property.location === filters.location
        : true;
      const matchesType = filters.propertyType
        ? property.type === filters.propertyType
        : true;
      const matchesBedrooms =
        !filters.bedrooms || property.beds === Number(filters.bedrooms);
      const matchesStatus = filters.status
        ? property.status === filters.status
        : true;
      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every(
          (a) => property.amenities?.includes(a) ?? false
        );
      const matchesUtilities =
        filters.utilities.length === 0 ||
        filters.utilities.every(
          (u) => property.utilities?.includes(u) ?? false
        );
      const matchesPrice =
        property.price >= filters.priceMin &&
        property.price <= filters.priceMax;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesBedrooms &&
        matchesStatus &&
        matchesAmenities &&
        matchesUtilities &&
        matchesPrice
      );
    });
  }, [backendListings, debouncedSearch, filters, isLoading]);

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredListings.slice(start, start + itemsPerPage);
  }, [filteredListings, currentPage, itemsPerPage]);

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
      priceMin: 0,
      priceMax: 700000,
      amenities: [],
      utilities: [],
      itemsPerPage: 12,
    });
    setCurrentPage(1);
    setItemsPerPage(12);
  };
  const clearTempFilters = () => setTempFilters({ ...filters });
  const initializeTempFilters = () => setTempFilters({ ...filters });
  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setCurrentPage(1);
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
    if (filters.priceMax < 700000)
      params.priceMax = filters.priceMax.toString();
    if (filters.amenities.length)
      params.amenities = filters.amenities.join(",");
    if (filters.utilities.length)
      params.utilities = filters.utilities.join(",");
    if (itemsPerPage !== 12) params.itemsPerPage = itemsPerPage.toString();
    params.page = currentPage.toString(); // always sync current page

    const currentParams = Object.fromEntries(searchParams.entries());
    if (JSON.stringify(currentParams) !== JSON.stringify(params)) {
      setSearchParams(params, { replace: true }); // ✅ replace instead of push
    }
  }, [
    debouncedSearch,
    filters,
    currentPage,
    itemsPerPage,
    searchParams,
    setSearchParams,
  ]);

  // Render
  return (
    <div className="container-fluid">
      <div className="row">
        {/*  Desktop Filters Sidebar */}
        <div className="col-xxl-3 col-xl-3 col-lg-4 d-none d-lg-block">
          <div className="sticky-top" style={{ top: "20px" }}>
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
              utilities={filters.utilities}
              setUtilities={(val) =>
                setFilters((prev) => ({ ...prev, utilities: val }))
              }
              clearAllFilters={clearFilters}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              {...filterOptions}
            />
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
                    {badge.label} {badge.remove && "×"}
                  </span>
                ))}
              </div>
            )}

            {/*  View Toggle */}
            <ViewToggle
              viewMode={viewMode}
              setViewMode={setViewMode}
              resultsCount={filteredListings.length}
              shownCount={paginatedListings.length}
            />

            {/*  Property Cards */}
            <div className="row g-3 g-md-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="col-12 col-sm-6 col-lg-4">
                    <div className={styles.imageLoader}></div>
                  </div>
                ))
              ) : paginatedListings.length === 0 ? (
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
                paginatedListings.map((property) => (
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
