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

// ---------------- Core Property Models ----------------

export interface BaseProperty {
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
  images?: string[];
  city?: string;
  neighborhood?: string;
  zip?: string;
  dateListed?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  coordinates?: Coordinates;
  host?: Host;
  state?: string;
  price_type?: string;
  status: "Valid" | "Invalid" | "Pending" | "Rented" | "Sold"; 
}

export interface Listing extends BaseProperty {
  image: string|null;
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
  itemsPerPage: number;
  priceType: string;
}

export interface FilterOptions {
  locations: OptionList;
  propertyTypes: OptionList;
  bedroomsOptions: OptionList;
  statuses: OptionList;
  amenitiesOptions: OptionList;
  minPrice: number;
  maxPrice: number;
}

export interface FiltersProps extends FilterState, FilterOptions {
  setLocation: StringSetter;
  setPropertyType: StringSetter;
  setBedrooms: StringSetter;
  setStatus: StringSetter;
  setPriceMin: NumberSetter;
  setPriceMax: NumberSetter;
  setAmenities: StringArraySetter;
  setItemsPerPage: NumberSetter;
  setPriceType: StringSetter;
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

// export interface Review {
//   id: number;
//   reviewer: string;
//   review: string;
//   property: {
//     title: string;
//     location: {
//       address: string;
//       city: string;
//     };
//   };
//   created_at: string;
//   date: string;
//   rating: number;
// }

export interface Review {
  id: number;
  property_id: number;
  user_id: number;
  comment: string; // Changed from 'review' to 'comment'
  rating: number;
  created_at: string;
  updated_at: string;
  property: {
    id: number;
    owner_id: number;
    title: string;
    description: string;
    type: string;
    price: string;
    price_type: string;
    location: {
      city: string;
      state: string;
      zip_code: string;
      address: string;
      latitude?: number;
      longitude?: number;
    };
    size: number;
    property_state: string;
    status: string;
    created_at: string;
    updated_at: string;
    bedrooms: number;
    bathrooms: number;
    is_in_wishlist: boolean;
  };
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    google_id: string | null;
    email_verified_at: string | null;
    email_otp: string | null;
    email_otp_expires_at: string | null;
    email_otp_sent_at: string | null;
    id_image_url: string;
    role: string;
    phone_number: string;
    status: string;
    phone_verified_at: string | null;
    whatsapp_otp: string | null;
    whatsapp_otp_expires_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface ReviewsListProps {
  reviews: Review[];
  reviewsPerPage?: number;
  totalReviews: number;
  onPageChange: NumberSetter;
  loading: boolean;
}

// ---------------- UI Props ----------------

export interface PropertyCardProps {
  property: Listing;
  viewMode: "grid" | "list";
  savedProperties: (string | number)[];
  toggleSavedProperty: (id: number) => void;
}

export interface CategoryCardProps {
  id: number;
  type: string;
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

// Update your types file to remove cancel-related props
export interface BookingCardProps {
  price: number;
  isSell: boolean;
  checkIn: string;
  setCheckIn: (value: string) => void;
  checkOut: string;
  setCheckOut: (value: string) => void;
  guests: string;
  setGuests: (value: string) => void;
  guestOptions: GuestOption[];
  onReserve: () => void;
  loading: boolean;
  errorMessage: string;
  nights: number;
  subtotal: number;
  total: number;
  property_state?: string;
  property_state: string;
}

export interface GuestOption {
  value: string;
  label: string;
}

// src/types/BookingHookReturn.ts
export type BookingHookReturn = {
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
  apiError: string | null;
  handleReserve: (propertyId: string) => Promise<void>;
};


export interface BookingSectionProps {
  property: Property;
  booking: BookingHookReturn;
  guestOptions: GuestOption[];
  errorMessages: string
    onReserve: () => void;
  onCancelRequest: () => void;
  isReservationSuccessful: boolean;
  rentRequestLoading: boolean;

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
  disabled?: boolean;
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

//-------------------------- Rent Request ----------------------------
export type RentRequest = {
  id: number;
  message: string;
  check_in: string;
  check_out: string;
  property_id: number;
  user_id: number;
  status: string;
};

// Laravel paginator response
export interface LaravelPaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

// Rent Request Query Params
export interface RentRequestQuery {
  userId?: number;
  status?: string;
  page?: number;
  per_page?: number;
}

// Create Rent Request Data
export interface CreateRentRequestData {
  property_id: number;
  check_in: string;
  check_out: string;
  message?: string;
  // Add other fields as needed
}

// Payment Data
export interface PaymentData {
  paymentMethod: string;
  amount: number;
  currency?: string;
  // Add other payment fields as needed
}

// Request Stats
export interface RequestStats {
  totalRequests: number;
  pendingRequests: number;
  confirmedRequests: number;
  cancelledRequests: number;
  rejectedRequests: number;
  paidRequests: number;
  // Add other stats as needed
}
