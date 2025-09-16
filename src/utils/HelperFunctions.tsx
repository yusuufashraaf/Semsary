import { Listing } from "src/types";

// Helper function
export const formatCurrency = (amount: number | string) => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(value)) return ""; // handle invalid strings
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper function to filter a single property
export const filterProperty = (
  property: Listing,
  filters: any,
  searchTerm: string
) => {
  const term = searchTerm.trim().toLowerCase();
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
    !filters.bedrooms || property.bedrooms === Number(filters.bedrooms);
  const matchesStatus = filters.status
    ? property.status === filters.status
    : true;
  const matchesAmenities =
    filters.amenities.length === 0 ||
    filters.amenities.every(
      (a: any) => property.amenities?.includes(a) ?? false
    );
  const matchesPrice =
    property.price >= filters.priceMin && property.price <= filters.priceMax;

  return (
    matchesSearch &&
    matchesLocation &&
    matchesType &&
    matchesBedrooms &&
    matchesStatus &&
    matchesAmenities &&
    matchesPrice
  );
};

// src/utils/helperFunctions.ts
export const formatActiveFilters = (filters: any, setFilters: Function) => {
  const badges: { label: string; remove?: () => void }[] = [];

  const addBadge = (label: string, remove?: () => void) =>
    badges.push({ label, remove });

  if (filters.location)
    addBadge(`Location: ${filters.location}`, () =>
      setFilters((prev: any) => ({ ...prev, location: "" }))
    );

  if (filters.propertyType)
    addBadge(`Type: ${filters.propertyType}`, () =>
      setFilters((prev: any) => ({ ...prev, propertyType: "" }))
    );

  if (filters.bedrooms)
    addBadge(`Beds: ${filters.bedrooms}`, () =>
      setFilters((prev: any) => ({ ...prev, bedrooms: "" }))
    );

  if (filters.status)
    addBadge(`Status: ${filters.status}`, () =>
      setFilters((prev: any) => ({ ...prev, status: "" }))
    );

  if (filters.amenities.length)
    addBadge(`Amenities: ${filters.amenities.join(", ")}`, () =>
      setFilters((prev: any) => ({ ...prev, amenities: [] }))
    );

  return badges;
};
