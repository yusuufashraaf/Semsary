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
  phone: string,
  email:string
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
  id: string|number;
  owner_id:string|number;
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
  image: string | null;
  property_state?: string;
  pending_buyer_id?: number;
  owner?: any | undefined; // Allow undefined

}

export type Property = Omit<BaseProperty, "images" | "coordinates" | "host"> & {
  images: string[];
  coordinates: Coordinates;
  host: Host;
};
export interface PropertyImage {
  id: number | string;
  image_url: string;
  description?: string;
  order_index?: number;
  original_filename?: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface PropertyDocument {
  id: number | string;
  document_url: string;
  document_type?: string;
  original_filename?: string;
  size?: number;
  uploaded_at?: string;
}

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
  sortBy: string;
  sortOrder: string;
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
  sortBy: string;
setSortBy: (val: string) => void;
sortOrder: string;
setSortOrder: (val: string) => void;

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
    sortBy: string;
  sortOrder: string;

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

export interface CreateReviewData {
  property_id: number;
  comment: string;
  rating: number;
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
    handleReserve: () => Promise<boolean>; 

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
  total_price: string;
  property?: {
    id: number;
    title: string;
    location: {
      address: string;
    };
    owner_id: number;
  };
  user_info: {
    first_name: string;
    last_name: string;
    role: string;
    phone_number: string;
  }
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
  payment_method_token?: string;
  expected_total?: number;
  idempotency_key: string;
  // Add other payment fields as needed
}
// export interface PaymentData {
//   paymentMethod: string;
//   amount: number;
//   currency?: string;
//   // Add other payment fields as needed
// }

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

// Re-export admin types
export * from './admin/admin';

// Re-export admin types
export * from './admin/admin';

export interface Chat {
  id: number;
  property_id: number;
  owner_id: number;
  renter_id: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  unread_count: number;
  property: {
    id: number;
    title: string;
    price: string;
    price_type: string;
    location: any;
  };
  owner: any;
  renter: any;
  latest_message?: Message;
}

export interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content?: string;
  is_read?: boolean;
  created_at?: string;
  updated_at?: string;
  sender?: any;
}
// ---------------- Checkout related types ----------------

export interface Checkout {
  id: number;
  rent_request_id: number;
  requester_id: number;
  requested_at: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'auto_confirmed'|'agent_review'| 'approved' | 'rejected_by_owner' | 'overridden_by_admin' | 'completed';
  type: 'before_checkin' | 'within_1_day' | 'after_1_day' | 'monthly_mid_contract';
  reason?: string;
  owner_confirmation: 'pending' | 'confirmed' | 'rejected' | 'not_required' | 'auto_confirmed';
  deposit_return_percent?: number;
  agent_notes?: string;
  owner_notes?: string;
  admin_note?: string;
  agent_decision?: AgentDecision;
  processed_at?: string;
  transaction_ref?: string;
  final_refund_amount?: string;
  final_payout_amount?: string;
  refund_purchase_id?: number;
  payout_purchase_id?: number;
  created_at: string;
  updated_at: string;
  
  // Relationships
  rentRequest?: RentRequest;
}

export interface AgentDecision {
  deposit_return_percent: number;
  rent_returned: boolean;
  notes?: string;
  decided_by: number | string;
  decided_at: string;
  override?: boolean;
}

export interface CheckoutAction {
  action: 'request_checkout' | 'agent_decision' | 'owner_confirm' | 'owner_reject' | 'admin_override';
  reason?: string;
  deposit_return_percent?: number;
  rent_returned?: boolean;
  notes?: string;
  damage_notes?: string;
  admin_note?: string;
  decision?: 'approve' | 'reject';
}

export interface CheckoutStats {
  as_renter: {
    pending: number;
    confirmed: number;
    rejected: number;
    total: number;
  };
  as_owner: {
    pending: number;
    confirmed: number;
    rejected: number;
    total: number;
  };
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data?: {
    checkout: Checkout;
    can_act: string[];
    message: string;
    refund_amount?: string;
    payout_amount?: string;
    transaction_ref?: string;
  };
  errors?: any;
}

export interface CheckoutQuery {
  page?: number;
  per_page?: number;
  status?: string;
  type?: string;
  from?: string;
  to?: string;
  phone_number?: string;
}

export interface Transaction {
  id: number;
  rent_request_id: number;
  user_id: number;
  property_id: number;
  amount: string;
  payment_type: 'payment' | 'refund' | 'payout';
  status: 'pending' | 'successful' | 'failed';
  payment_gateway: string;
  transaction_ref: string;
  idempotency_key: string;
  metadata?: {
    checkout_id?: number;
    deposit_refund?: string;
    rent_refund?: string;
    deposit_payout?: string;
    rent_payout?: string;
    deposit_return_percent?: number;
  };
  created_at: string;
  updated_at: string;
  
  // Relationships
  rentRequest?: {
    id: number;
    property: {
      id: number;
      title: string;
      location: string;
      owner_id: number;
    };
    user: {
      id: number;
      first_name: string;
      last_name: string;
      phone_number: string;
    };
  };
}

// -------------------- NEW ADDITIONS --------------------

// Purchase
export interface PropertyPurchase {
  id: number;
  property_id: number;
  buyer_id: number;
  seller_id: number;
  amount: string;
  status: "pending" | "paid" | "cancelled" | "refunded";
  payment_gateway: string;
  transaction_ref: string;
  idempotency_key: string;
  cancellation_deadline: string;
  metadata: {
    wallet_used?: string;
    gateway_charged?: number;
  };
  created_at: string;
  updated_at: string;
  property?: Property & { owner?: any };
}

// Escrow
export interface PropertyEscrow {
  id: number;
  property_purchase_id: number;
  property_id: number;
  buyer_id: number;
  seller_id: number;
  amount: string;
  status: "locked" | "released" | "refunded";
  locked_at: string;
  scheduled_release_at: string;
  created_at: string;
  updated_at: string;
}

// Wallet
export interface Wallet {
  id: number;
  user_id: number;
  balance: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

// API Response for purchase
export interface PurchaseResponse {
  success: boolean;
  message: string;
  data?: {
    purchase: PropertyPurchase;
    escrow: PropertyEscrow;
    property: Property;
    seller: any;
  };
}
