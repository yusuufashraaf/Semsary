// src/types/admin/admin.ts

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
}

export interface UsersByRole {
  user: number;
  owner: number;
  agent: number;
  admin: number;
}

export interface PropertiesByStatus {
  Valid: number;
  Pending: number;
  Rented: number;
  Sold: number;
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
}

export type UserRole = "user" | "owner" | "agent" | "admin";
export type UserStatus = "active" | "inactive" | "pending" | "suspended";

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
}

export interface PropertyLocation {
  city: string;
  state: string;
  address: string;
  latitude: number;
  zip_code: string;
  longitude: number;
}

export type PropertyType =
  | "Apartment"
  | "House"
  | "Commercial"
  | "Land"
  | "Duplex";
export type PriceType = "Daily" | "Monthly" | "FullPay";
export type PropertyState = "Valid" | "Pending" | "Rented" | "Sold";
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
}

export type TransactionType = "rent" | "buy";
export type TransactionStatus = "pending" | "success" | "failed" | "refunded";
export type PaymentGateway = "PayMob" | "PayPal" | "Fawry" | "Wallet";

// API Response Types
export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Filter Types
export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface PropertyFilters {
  status?: PropertyState;
  type?: PropertyType;
  price_min?: number;
  price_max?: number;
  location?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface TransactionFilters {
  status?: TransactionStatus;
  type?: TransactionType;
  payment_gateway?: PaymentGateway;
  amount_min?: number;
  amount_max?: number;
  date_from?: string;
  date_to?: string;
  user_id?: number;
  property_id?: number;
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
  }[];
}

export interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

// Component Props Types
export interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
    period: string;
  };
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  loading?: boolean;
}

export interface StatusBadgeProps {
  status: UserStatus | PropertyState | TransactionStatus;
  size?: "sm" | "md" | "lg";
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
  onRowClick?: (item: T) => void;
  selectedRows?: number[];
  onRowSelect?: (ids: number[]) => void;
}

// Form Types
export interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  status: UserStatus;
}

export interface PropertyApprovalData {
  property_id: number;
  action: "approve" | "reject";
  notes?: string;
  reason?: string;
}

export interface TransactionRefundData {
  transaction_id: number;
  amount: number;
  reason: string;
  partial: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Query Keys for TanStack Query
export const QUERY_KEYS = {
  DASHBOARD: {
    STATS: ["dashboard", "stats"] as const,
    REVENUE_CHART: ["dashboard", "revenue-chart"] as const,
    USER_CHART: ["dashboard", "user-chart"] as const,
    PROPERTY_CHART: ["dashboard", "property-chart"] as const,
  },
  USERS: {
    LIST: (filters?: UserFilters) => ["users", "list", filters] as const,
    DETAIL: (id: number) => ["users", "detail", id] as const,
    TRANSACTIONS: (id: number) => ["users", "transactions", id] as const,
    PROPERTIES: (id: number) => ["users", "properties", id] as const,
  },
  PROPERTIES: {
    LIST: (filters?: PropertyFilters) =>
      ["properties", "list", filters] as const,
    DETAIL: (id: number) => ["properties", "detail", id] as const,
    PENDING_VERIFICATION: ["properties", "pending-verification"] as const,
  },
  TRANSACTIONS: {
    LIST: (filters?: TransactionFilters) =>
      ["transactions", "list", filters] as const,
    DETAIL: (id: number) => ["transactions", "detail", id] as const,
    SUMMARY: ["transactions", "summary"] as const,
  },
  AGENTS: {
    LIST: ["agents", "list"] as const,
  },
} as const;
