// C:\laragon\www\Semsary\src\types\admin\admin.ts

// Notification Types
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

// Dashboard Statistics Types
export interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalTransactions: number;
  totalRevenue: string;
  usersByRole: UsersByRole;
  propertiesByStatus: PropertiesByStatus;
  transactionsByType: TransactionsByType;
  monthlyRevenue: Record<string, string>;
  recentTransactions: Transaction[];
  topProperties: Property[];
  userGrowth: Record<string, number>;
  propertyGrowth?: Record<string, number>;
  transactionGrowth?: Record<string, number>;
  revenueGrowth?: Record<string, number>;
}

export interface UsersByRole {
  user: number;
  owner: number;
  agent: number;
  admin: number;
}

export interface PropertiesByStatus {
  Valid: number;
  Invalid: number;
  Pending: number;
  Rented: number;
  Sold: number;
  Approved: number;
  Rejected: number;
}

export interface TransactionsByType {
  rent: number;
  buy: number;
}

// User Types
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  google_id: string | null;
  email_verified_at: string | null;
  email_otp: string | null;
  email_otp_expires_at: string | null;
  id_image_url: string | null;
  role: UserRole;
  phone_number: string;
  status: UserStatus;
  phone_verified_at: string | null;
  whatsapp_otp: string | null;
  whatsapp_otp_expires_at: string | null;
  created_at: string;
  updated_at: string;
  full_name?: string; // Computed property
  avatar?: string; // Profile image URL
  last_login_at?: string;
  properties_count?: number;
  transactions_count?: number;
}

export type UserRole = "user" | "owner" | "agent" | "admin";
export type UserStatus = "active" | "pending" | "suspended" | "blocked";

// Agent Types - Updated for the new API structure
export interface Agent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  active_assignments: number;
  completed_assignments: number;
  workload_status: 'low' | 'medium' | 'high';
  created_at: string;
  profile_image?: string;
}

export interface ProcessedAgent extends Agent {
  current_property_count: number;
  max_property_capacity: number;
  status: 'active' | 'busy' | 'offline';
}

// Property Types
export interface Property {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  type: PropertyType;
  price: string;
  price_type: PriceType;
  location: PropertyLocation;
  size: number;
  property_state: PropertyState;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
  bedrooms: number;
  bathrooms: number;
  is_in_wishlist: boolean;
  transactions_count?: number;
  owner?: User;
  images?: PropertyImage[];
  amenities?: PropertyAmenity[];
  view_count?: number;
  favorite_count?: number;
  is_featured?: boolean;
  featured_until?: string | null;
  commission?: number;
  commission_type?: "percentage" | "fixed";
  assigned_cs_agent?: number | null; // Added for assignment status
}

export interface PropertyLocation {
  city: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  country?: string;
  zip_code?: string;
  neighborhood?: string;
}

export interface PropertyImage {
  id: number;
  property_id: number;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  order: number;
  created_at: string;
}

export interface PropertyAmenity {
  id: number;
  name: string;
  icon?: string;
  category?: string;
  is_active: boolean;
}

export type PropertyType =
  | "Apartment"
  | "House"
  | "Commercial"
  | "Land"
  | "Duplex"
  | "Villa"
  | "Roof"
  | "Studio"
  | "Penthouse"
  | "Townhouse"
  | "Office"
  | "Retail"
  | "Warehouse";

export type PriceType = "Daily" | "Monthly" | "FullPay" | "Yearly";

// UPDATED PropertyState to include all possible values
export type PropertyState = 
  | "Valid" 
  | "Invalid" 
  | "Pending" 
  | "Rented" 
  | "Sold" 
  | "Approved" 
  | "Rejected"
  | "Draft"
  | "Expired"
  | "Archived";

export type PropertyStatus = "sale" | "rent" | "both";

// Transaction Types
export interface Transaction {
  id: number;
  user_id: number;
  property_id: number;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  deposit_amount: string;
  payment_gateway: PaymentGateway;
  created_at: string;
  updated_at: string;
  user: User;
  property: Property;
  reference_number?: string;
  notes?: string;
  payment_date?: string;
  refund_amount?: string;
  refund_date?: string;
  commission_amount?: string;
  commission_paid?: boolean;
  contract_start_date?: string;
  contract_end_date?: string;
}

export type TransactionType = "rent" | "buy";
export type TransactionStatus = "pending" | "success" | "failed" | "refunded" | "cancelled" | "expired";
export type PaymentGateway = "PayMob" | "PayPal" | "Fawry" | "Wallet" | "Bank Transfer" | "Cash";

export interface UserFilters {
  search?: string;
  role?: UserRole[];
  status?: UserStatus[];
  email_verified?: boolean;
  phone_verified?: boolean;
  date_from?: string;
  date_to?: string;
  date_range?: {
    start: string;
    end: string;
  };
  sort_by?: "first_name" | "last_name" | "email" | "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
  per_page?: number;
}

export interface PropertyFilters {
  search?: string;
  type?: PropertyType[];
  property_state?: PropertyState[];
  status?: PropertyStatus[];
  price_range?: {
    min: number;
    max: number;
  };
  price_type?: PriceType[];
  location?: string;
  bedrooms?: number[];
  bathrooms?: number[];
  size_range?: {
    min: number;
    max: number;
  };
  owner_id?: number;
  is_featured?: boolean;
  date_range?: {
    start: string;
    end: string;
  };
  sort_by?: "title" | "price" | "size" | "created_at" | "updated_at" | "view_count";
  sort_order?: "asc" | "desc";
  per_page?: number;
}

export interface TransactionFilters {
  search?: string;
  type?: TransactionType[];
  status?: TransactionStatus[];
  payment_gateway?: PaymentGateway[];
  amount_range?: {
    min: number;
    max: number;
  };
  user_id?: number;
  property_id?: number;
  date_range?: {
    start: string;
    end: string;
  };
  sort_by?: "amount" | "created_at" | "updated_at" | "payment_date";
  sort_order?: "asc" | "desc";
}

// Bulk Action Types
export interface BulkAction {
  action: BulkActionType;
  ids: number[];
  data?: Record<string, any>;
}

export type BulkActionType = 
  | "activate"
  | "suspend" 
  | "block"
  | "delete"
  | "approve"
  | "reject"
  | "feature"
  | "unfeature"
  | "archive"
  | "restore";

// Form Data Types
export interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  status?: UserStatus;
  password?: string;
  confirm_password?: string;
  id_image?: File;
  send_welcome_email?: boolean;
}

export interface PropertyFormData {
  title: string;
  description: string;
  type: PropertyType;
  price: string;
  price_type: PriceType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  size: number;
  location: {
    address: string;
    city: string;
    state: string;
    country?: string;
    zip_code?: string;
    latitude?: number;
    longitude?: number;
  };
  owner_id?: number;
  amenities?: number[];
  images?: File[];
  is_featured?: boolean;
  commission?: number;
  commission_type?: "percentage" | "fixed";
}

// Activity Log Types
export interface ActivityLog {
  id: number;
  user_id?: number;
  admin_id?: number;
  action: ActivityAction;
  target_type: ActivityTargetType;
  target_id: number;
  description: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: User;
  admin?: User;
}

export type ActivityAction = 
  | "created"
  | "updated" 
  | "deleted"
  | "approved"
  | "rejected"
  | "activated"
  | "suspended"
  | "blocked"
  | "featured"
  | "unfeatured"
  | "login"
  | "logout"
  | "password_reset"
  | "email_verified"
  | "phone_verified";

export type ActivityTargetType = "user" | "property" | "transaction" | "system";

// Settings Types
export interface SystemSettings {
  id: number;
  key: string;
  value: string;
  type: SettingType;
  group: SettingGroup;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export type SettingType = "string" | "number" | "boolean" | "json" | "text";
export type SettingGroup = 
  | "general"
  | "email"
  | "sms" 
  | "payment"
  | "property"
  | "user"
  | "security"
  | "features";

// API Response Types
export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  path?: string;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationError[];
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ComparisonDataPoint {
  category: string;
  current: number;
  previous: number;
  change?: number;
  changePercentage?: number;
}

// Report Types
export interface ReportConfig {
  id: string;
  name: string;
  type: ReportType;
  filters: Record<string, any>;
  date_range: {
    start: string;
    end: string;
  };
  format: ReportFormat;
  schedule?: ReportSchedule;
  recipients?: string[];
  created_by: number;
  created_at: string;
}

export type ReportType = 
  | "users"
  | "properties" 
  | "transactions"
  | "revenue"
  | "analytics"
  | "performance"
  | "activity";

export type ReportFormat = "pdf" | "excel" | "csv" | "json";

export interface ReportSchedule {
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  day_of_week?: number; // 0-6 (Sunday-Saturday)
  day_of_month?: number; // 1-31
  time?: string; // HH:MM format
  timezone?: string;
  is_active: boolean;
}

// Export utility types
export type ApiEndpoint = string;
export type QueryKey = string[];
export type MutationKey = string;

// Table configuration types
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => React.ReactNode;
  hidden?: boolean;
}

export interface TableConfig<T = any> {
  columns: TableColumn<T>[];
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  showTotal?: boolean;
  stickyHeader?: boolean;
}

// Permission Types
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

// Cache Types
export interface CacheStats {
  total_keys: number;
  memory_usage: string;
  hit_rate: number;
  miss_rate: number;
  evictions: number;
  connections: number;
}

// System Health Types
export interface SystemHealth {
  status: "healthy" | "degraded" | "unhealthy";
  checks: HealthCheck[];
  timestamp: string;
}

export interface HealthCheck {
  name: string;
  status: "pass" | "fail" | "warn";
  message?: string;
  duration?: number;
  details?: Record<string, any>;
}

// Query Keys for React Query
export const QUERY_KEYS = {
  DASHBOARD: {
    STATS: ['dashboard', 'stats'] as const,
    REVENUE_CHART: ['dashboard', 'revenue-chart'] as const,
    USER_CHART: ['dashboard', 'user-chart'] as const,
    PROPERTY_CHART: ['dashboard', 'property-chart'] as const,
  },
  USERS: {
    LIST: (filters?: any) => ['users', 'list', filters] as const,
    DETAIL: (id: number) => ['users', 'detail', id] as const,
    TRANSACTIONS: (id: number) => ['users', 'transactions', id] as const,
    PROPERTIES: (id: number) => ['users', 'properties', id] as const,
  },
  PROPERTIES: {
    LIST: (filters?: any) => ['properties', 'list', filters] as const,
    DETAIL: (id: number) => ['properties', 'detail', id] as const,
    PENDING_VERIFICATION: ['properties', 'pending-verification'] as const,
    STATISTICS: ['properties', 'statistics'] as const,
  },
  AGENTS: {
    LIST: ['agents', 'list'] as const,
  },
  TRANSACTIONS: {
    LIST: (filters?: any) => ['transactions', 'list', filters] as const,
    DETAIL: (id: number) => ['transactions', 'detail', id] as const,
    SUMMARY: ['transactions', 'summary'] as const,
  },
} as const;