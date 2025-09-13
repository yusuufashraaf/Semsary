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

/**
 * Base property fields shared by `Listing` and `Property`.
 */
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
}

/**
 * Lightweight property model for listing views, cards, or previews.
 */
export interface Listing extends BaseProperty {
  /** Main thumbnail image */
  image: string;
}

/**
 * Full property details model for single property pages.
 */
export type Property = Omit<BaseProperty, "images" | "coordinates" | "host"> & {
  images: string[];
  coordinates: Coordinates;
  host: Host;
};

// ---------------- Filters ----------------

/**
 * Represents the state of active property filters.
 */
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

/**
 * Represents available filter options.
 */
export interface FilterOptions {
  locations: OptionList;
  propertyTypes: OptionList;
  bedroomsOptions: OptionList;
  statuses: OptionList;
  amenitiesOptions: OptionList;
  utilitiesOptions: OptionList;
}

/**
 * Props for filter components, combining state, setters, and options.
 */
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

/**
 * Props for mobile filters modal component.
 */
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

/**
 * Review model.
 */
export interface Review {
  id: number;
  reviewer: string;
  review: string;
  date: string;
  rating: number;
}

/**
 * Props for reviews list component.
 */
export interface ReviewsListProps {
  reviews: Review[];
  reviewsPerPage?: number;
  totalReviews: number;
  onPageChange: NumberSetter;
  loading?: boolean;
}

// ---------------- UI Props ----------------

/**
 * Props for property cards used in lists or grids.
 */
export interface PropertyCardProps {
  property: Listing;
  viewMode: "grid" | "list";
  savedProperties: (string | number)[];
  toggleSavedProperty: (id: number) => void;
}

/**
 * Props for category cards (e.g., popular property categories).
 */
export interface CategoryCardProps {
  name: string;
  image: string;
  link: string;
}

/**
 * Similar property model for recommendation cards.
 */
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

/**
 * Props for a single similar property card.
 */
export interface SimilarPropertyCardProps {
  property: SimilarProperty;
  loading?: boolean;
}

// ---------------- Booking ----------------

/**
 * Guest dropdown options.
 */
export interface GuestOption {
  value: string;
  label: string;
}

/**
 * Props for the booking card component.
 */
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

/**
 * Return type for the booking hook.
 */
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

/**
 * Props for the booking section wrapper.
 */
export interface BookingSectionProps {
  property: Property;
  booking: BookingHookReturn;
  guestOptions: GuestOption[];
}

// ---------------- Misc UI ----------------

/**
 * Props for action buttons (e.g., Contact, View More).
 */
export interface ActionButtonsProps {
  onContact?: () => void;
  onViewMore?: () => void;
  disabledButton?: "contact" | "viewMore" | null;
}

/**
 * Props for displaying a list of amenities.
 */
export interface AmenitiesListProps {
  amenities: Amenities;
}

/**
 * Props for breadcrumb navigation.
 */
export interface BreadcrumbProps {
  propertyId: string;
}

/**
 * Props for displaying host details.
 */
export interface HostCardProps {
  host: Host;
}

/**
 * Props for property details section.
 */
export interface PropertyDetailsCardProps {
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  amenities?: Amenities;
}

/**
 * Props for property header information.
 */
export interface PropertyHeaderProps {
  address: string;
  type: string;
  rating: number;
  reviewCount: number;
}

// ---------------- Pagination & Scroll ----------------

/**
 * Props for pagination component.
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: NumberSetter;
  scrollToTop: () => void;
}

/**
 * Props for a scroll-to-top button.
 */
export interface ScrollTopButtonProps {
  scrollToTop: () => void;
}

// ---------------- Image Carousel ----------------

/**
 * Props for an image carousel.
 */
export interface ImageCarouselProps {
  images: string[];
  isSaved?: boolean;
  onToggleSaved?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// ---------------- Map ----------------

/**
 * Props for a map component.
 */
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
