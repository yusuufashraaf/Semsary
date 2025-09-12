// Core property types
export type Listing = {
  id: number;
  image: string;
  title: string;
  beds: number;
  baths: number;
  sqft: number;
  price: number;
  status?: string;
  dateListed: string;
  description?: string;
  city?: string;
  neighborhood?: string;
  address?: string;
  zip?: string;
  type?: string;
  amenities?: string[];
  utilities?: string[];
  location?: string;
};

export type PropertyCardProps = {
  property: Listing;
  viewMode: "grid" | "list";
  savedProperties: number[];
  toggleSavedProperty: (id: number) => void;
};

export type CategoryCardProps = {
  name: string;
  image: string;
  link: string;
};

// Filters types and state
export type FiltersProps = {
  location: string;
  setLocation: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  priceMin: number;
  setPriceMin: (value: number) => void;
  priceMax: number;
  setPriceMax: (value: number) => void;
  amenities: string[];
  setAmenities: (amenities: string[]) => void;
  utilities: string[];
  setUtilities: (utilities: string[]) => void;
  clearAllFilters: () => void;

  // Options fetched from backend
  locations: string[];
  propertyTypes: string[];
  bedroomsOptions: string[];
  statuses: string[];
  amenitiesOptions: string[];
  utilitiesOptions: string[];
  itemsPerPage: number;
  setItemsPerPage: (num: number) => void;
};

export interface FilterState {
  location: string;
  propertyType: string;
  bedrooms: string;
  status: string;
  priceMin: number;
  priceMax: number;
  amenities: string[];
  utilities: string[];
  itemsPerPage: number;
}

export interface FilterOptions {
  locations: string[];
  propertyTypes: string[];
  bedroomsOptions: string[];
  statuses: string[];
  amenitiesOptions: string[];
  utilitiesOptions: string[];
}

// Mobile filters modal props
export interface MobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempFilters: FilterState;
  setTempFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  clearTempFilters: () => void;
  applyFilters: () => void;
  filterOptions: FilterOptions;
  itemsPerPage: number;
  setItemsPerPage: (num: number) => void;
}

// Pagination and scroll components
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scrollToTop: () => void;
};

export type ScrollTopButtonProps = {
  scrollToTop: () => void;
};

export type TLoading ="idle" | "pending" | "succeeded" | "failed";
export type Step = "Account Setup" | "Email Verification" | "Phone Verification" | "Image With ID";


export interface Property {
  id: number;
  address: string;
  price: string;
  saved: boolean;
  image: string;
}

export interface SavedSearch {
  id: number;
  title: string;
  location: string;
  checked: boolean;
}

export interface UserData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export type AccountTab = 'personal' | 'kyc' | 'security' | 'actions';