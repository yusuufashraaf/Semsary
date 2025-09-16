// ---------------- Utility Types ----------------

/**
 * Loading states used across API calls or async components.
 */
export type TLoading = "idle" | "pending" | "succeeded" | "failed";

/**
 * Reusable generic type for option lists.
 */
export type OptionList<T = string> = T[];

/**
 * Common setter types to avoid repetition.
 */
export type StringSetter = (value: string) => void;
export type NumberSetter = (value: number) => void;
export type StringArraySetter = (value: string[]) => void;

/**
 * Represents latitude and longitude coordinates.
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Host or property owner information.
 */
export interface Host {
  name: string;
  avatar: string;
  joinDate: string;
}

export type Props = {
  property: Property;
} & ReviewsListProps;

/**
 * Common type aliases for repetitive string arrays.
 */
export type Amenities = string[];
export type Utilities = string[];

// ---------------- Core Property Models ----------------

interface BaseProperty {
  id: string;
  title?: string;
  address?: string;
  price: number;
  type?: string;
  bedrooms: number;
  bathrooms?: number;
  sqft?: number;
  description?: string;
  amenities?: Amenities;
  utilities?: Utilities;
  images?: string[];
  city?: string;
  neighborhood?: string;
  zip?: string;
  status?: string;
  dateListed?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  coordinates?: Coordinates;
  host?: Host;
  state?: string;
  price_type?: string;
}

export interface Listing extends BaseProperty {
  image: string;
}

export type Property = Omit<BaseProperty, "images" | "coordinates" | "host"> & {
  images: string[];
  coordinates: Coordinates;
  host: Host;
};

// ---------------- Filters ----------------

export interface FilterState {
  location: string;
  propertyType: string;
  bedrooms: string;
  status: string;
  priceMin: number;
  priceMax: number;
  amenities: Amenities;
  utilities: Utilities;
  itemsPerPage: number;
}

export interface FilterOptions {
  locations: OptionList;
  propertyTypes: OptionList;
  bedroomsOptions: OptionList;
  statuses: OptionList;
  amenitiesOptions: OptionList;
  utilitiesOptions: OptionList;
}

export interface FiltersProps extends FilterState, FilterOptions {
  setLocation: StringSetter;
  setPropertyType: StringSetter;
  setBedrooms: StringSetter;
  setStatus: StringSetter;
  setPriceMin: NumberSetter;
  setPriceMax: NumberSetter;
  setAmenities: StringArraySetter;
  setUtilities: StringArraySetter;
  setItemsPerPage: NumberSetter;
  clearAllFilters: () => void;
}

export interface MobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempFilters: FilterState;
  setTempFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  clearTempFilters: () => void;
  applyFilters: () => void;
  filterOptions: FilterOptions;
  itemsPerPage: number;
  setItemsPerPage: NumberSetter;
}

// ---------------- Reviews ----------------

export interface Review {
  id: number;
  reviewer: string;
  review: string;
  date: string;
  rating: number;
}

export interface ReviewsListProps {
  reviews: Review[];
  reviewsPerPage?: number;
  totalReviews: number;
  onPageChange: NumberSetter;
  loading?: boolean;
}

// ---------------- UI Props ----------------

export interface PropertyCardProps {
  property: Listing;
  viewMode: "grid" | "list";
  savedProperties: (string | number)[];
  toggleSavedProperty: (id: number) => void;
}

export interface CategoryCardProps {
  name: string;
  image: string;
  link: string;
}

export interface SimilarProperty
  extends Pick<Listing, "id" | "image" | "title"> {
  price: string;
  rating?: number;
  location?: string;
}

export type SimilarProps = {
  properties: SimilarProperty[];
  loading: boolean;
};

export interface SimilarPropertyCardProps {
  property: SimilarProperty;
  loading?: boolean;
}

// ---------------- Booking ----------------

export interface GuestOption {
  value: string;
  label: string;
}

export interface BookingCardProps {
  price: number;
  isSell?: boolean;
  checkIn: string;
  setCheckIn: React.Dispatch<React.SetStateAction<string>>;
  checkOut: string;
  setCheckOut: React.Dispatch<React.SetStateAction<string>>;
  guests: string;
  setGuests: React.Dispatch<React.SetStateAction<string>>;
  guestOptions: GuestOption[];
  onReserve?: () => void;
  loading?: boolean;
  errorMessage?: string;
  nights: number;
  subtotal: number;
  total: number;
}

export interface BookingHookReturn {
  checkIn: string;
  setCheckIn: React.Dispatch<React.SetStateAction<string>>;
  checkOut: string;
  setCheckOut: React.Dispatch<React.SetStateAction<string>>;
  guests: string;
  setGuests: React.Dispatch<React.SetStateAction<string>>;
  nights: number;
  subtotal: number;
  total: number;
  loading: boolean;
  errors: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
  handleReserve: (propertyId: string) => Promise<void>;
}

export interface BookingSectionProps {
  property: Property;
  booking: BookingHookReturn;
  guestOptions: GuestOption[];
}

// ---------------- Misc UI ----------------

export interface ActionButtonsProps {
  onContact?: () => void;
  onViewMore?: () => void;
  disabledButton?: "contact" | "viewMore" | null;
}

export interface AmenitiesListProps {
  amenities: Amenities;
}

export interface BreadcrumbProps {
  propertyId: string;
}

export interface HostCardProps {
  host: Host;
}

export interface PropertyDetailsCardProps {
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  amenities?: Amenities;
}

export interface PropertyHeaderProps {
  address: string;
  type: string;
  rating: number;
  reviewCount: number;
}

// ---------------- Pagination & Scroll ----------------

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: NumberSetter;
  scrollToTop: () => void;
}

export interface ScrollTopButtonProps {
  scrollToTop: () => void;
}

// ---------------- Image Carousel ----------------

export interface ImageCarouselProps {
  images: string[];
  isSaved?: boolean;
  onToggleSaved?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// ---------------- Map ----------------

export interface LocationMapProps {
  lat: number;
  lng: number;
  height?: number;
}

// ---------------- WishList ----------------

export interface AddToWishlistProps {
  isSaved: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

// ---------------- Error message ----------------

export interface ErrorMessageProps {
  message?: string;
  visible?: boolean;
}

// ---------------- Error screen ----------------

export interface ErrorScreenProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

// ---------------- Loader spinner ----------------

export interface LoaderProps {
  message?: string;
}

// ---------------- Loader screen ----------------

export interface LoadingScreenProps {
  message?: string;
  propertyId?: string | number;
}

// ---------------- Additional types from develop ----------------

export type Step =
  | "Account Setup"
  | "Email Verification"
  | "Phone Verification"
  | "Image With ID";

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

export type AccountTab = "personal" | "kyc" | "security" | "actions";
