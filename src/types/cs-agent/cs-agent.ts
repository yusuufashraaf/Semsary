// CS Agent Type Definitions
// Following the pattern from src/types/admin/admin.ts

// ==================== User & Agent Types ====================
export interface CsAgent {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  status: AgentStatus;
  role: "CS_Agent" | "agent";
  active_assignments: number;
  completed_assignments: number;
  workload_status: WorkloadStatus;
  average_completion_time?: string;
  created_at: string;
  updated_at?: string;
}

export type AgentStatus = "active" | "pending" | "suspended" | "blocked";
export type WorkloadStatus =
  | "available"
  | "low"
  | "medium"
  | "high"
  | "overloaded";

// ==================== Property Assignment Types ====================
export interface PropertyAssignment {
  id: number;
  property_id: number;
  cs_agent_id: number;
  status: VerificationStatus;
  formatted_status?: string;
  notes?: string;
  priority: Priority;
  assigned_at: string;
  started_at?: string;
  completed_at?: string;
  rejected_at?: string;
  duration_hours?: number;
  created_at: string;
  updated_at?: string;
  property: AssignedProperty;
  cs_agent?: CsAgent;
  assigned_by?: AdminUser;
  documents?: UploadedDocument[];

  // Property fields returned directly from API
  title: string;
  description?: string;
  type?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    full_address?: string;
  };
  owner?: {
    id: number;
    name: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    status?: string;
    member_since?: string;
  };
  images?: PropertyImage[];
  features?: PropertyFeature[];
  assignment?: {
    id: number;
    status: VerificationStatus;
    formatted_status?: string;
    notes?: string;
    priority: Priority;
    assigned_at: string;
    started_at?: string;
    completed_at?: string;
    duration_hours?: number;
    assigned_by?: {
      id: number;
      name: string;
      email?: string;
    };
  };
}

export interface AssignedProperty {
  id: number;
  title: string;
  description?: string;
  type: PropertyType;
  price: number;
  formatted_price?: string;
  property_state: PropertyState;
  location?:
    | {
        address?: string;
        city?: string;
        state?: string;
        zip_code?: string;
        country?: string;
        coordinates?: {
          latitude: number;
          longitude: number;
        };
        full_address?: string;
      }
    | string; // Allow string for flexibility
  address?: string;
  created_at: string;
  owner?: PropertyOwner;
  images?: PropertyImage[];
}

export interface PropertyOwner {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  member_since?: string;
}

export interface PropertyImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  order_index: number;
}

export interface PropertyFeature {
  id: number;
  name: string;
  category?: string;
  icon?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

export type VerificationStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "rejected"
  | "cancelled";
export type Priority = "low" | "normal" | "high" | "urgent";
export type PropertyType = "Apartment" | "Villa" | "Duplex" | "Roof" | "Land";
export type PropertyState = "Valid" | "Invalid" | "Pending" | "Rented" | "Sold";

// ==================== Dashboard Types ====================
export interface CsAgentDashboard {
  agent: CsAgent;
  assignments?: {
    active: number;
    completed: number;
    average_completion_time: string | null; // API shows null or string
  };
  recent_assignments?: PropertyAssignment[]; // More specific type
}

export interface DashboardMetrics {
  total_assignments: MetricValue;
  pending_assignments: PendingMetric;
  in_progress_assignments: ProgressMetric;
  completed_assignments: CompletedMetric;
  completion_rate: RateMetric;
  avg_completion_time: TimeMetric;
  active_agents: AgentMetric;
}

export interface MetricValue {
  value: number;
  change_from_last_month?: number;
  trend?: "up" | "down" | "stable";
}

export interface PendingMetric {
  value: number;
  urgent_count: number;
  overdue_count: number;
}

export interface ProgressMetric {
  value: number;
  today: number;
  this_week: number;
}

export interface CompletedMetric {
  value: number;
  today: number;
  this_week: number;
  this_month: number;
}

export interface RateMetric {
  value: number;
  this_month: number;
  target: number;
}

export interface TimeMetric {
  value: number;
  unit: string;
  this_month: number;
  target: number;
}

export interface AgentMetric {
  value: number;
  with_assignments: number;
  available: number;
}

export interface RecentActivity {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  property?: AssignedProperty;
  agent?: CsAgent;
  status?: VerificationStatus;
  priority?: Priority;
  timestamp: string;
  time_ago: string;
}

export type ActivityType =
  | "assignment_created"
  | "assignment_completed"
  | "assignment_started"
  | "assignment_rejected"
  | "document_uploaded";

export interface AssignmentsOverview {
  by_status: StatusCount[];
  by_priority: PriorityCount[];
  total: number;
}

export interface StatusCount {
  status: VerificationStatus;
  count: number;
  label: string;
  percentage: number;
  color: string;
}

export interface PriorityCount {
  priority: Priority;
  count: number;
  label: string;
  percentage: number;
}

export interface AgentPerformance {
  id: number;
  name: string;
  email: string;
  total_assignments: number;
  completed_assignments: number;
  pending_assignments: number;
  in_progress_assignments: number;
  completion_rate: number;
  average_completion_time: number;
  workload_status: WorkloadStatus;
}

export interface PendingActions {
  overdue_assignments: OverdueAssignment[];
  urgent_assignments: UrgentAssignment[];
  stale_in_progress: StaleAssignment[];
  unassigned_properties: UnassignedProperty[];
}

export interface OverdueAssignment {
  id: number;
  property_title: string;
  agent_name: string;
  days_overdue: number;
  priority: Priority;
}

export interface UrgentAssignment {
  id: number;
  property_title: string;
  agent_name: string;
  status: VerificationStatus;
  assigned_at: string;
}

export interface StaleAssignment {
  id: number;
  property_title: string;
  agent_name: string;
  days_in_progress: number;
  started_at: string;
}

export interface UnassignedProperty {
  id: number;
  title: string;
  type: PropertyType;
  owner_name: string;
  created_at: string;
  days_pending: number;
}

// ==================== Chart Types ====================
export interface ChartData {
  chart_data: ChartPoint[];
  period: string;
  date_range: {
    start: string;
    end: string;
  };
  statuses?: string[];
}

export interface ChartPoint {
  date: string;
  formatted_date: string;
  pending?: number;
  in_progress?: number;
  completed?: number;
  rejected?: number;
  [key: string]: string | number | undefined;
}

export interface PerformanceData {
  performance_data: AgentPerformancePoint[];
  period: string;
  date_range: {
    start: string;
    end: string;
  };
}

export interface AgentPerformancePoint {
  agent_name: string;
  total_assignments: number;
  completed_assignments: number;
  completion_rate: number;
}

export interface WorkloadDistribution {
  workload_distribution: WorkloadCategory[];
  total_agents: number;
}

export interface WorkloadCategory {
  status: WorkloadStatus;
  count: number;
  label: string;
  agents: CsAgent[];
}

// ==================== Request/Response Types ====================
export interface AssignmentFilters {
  cs_agent_id?: number;
  status?: VerificationStatus[];
  property_id?: number;
  property_type?: PropertyType;
  property_state?: PropertyState;
  assigned_by?: number;
  date_from?: string;
  date_to?: string;
  priority?: Priority;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface PaginatedResponse<T> {
  status: "success" | "error";
  data: T[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  filters_applied?: Record<string, unknown>;
  message?: string;
  error?: string;
}

export interface ApiResponse<T> {
  status?: "success" | "error";
  success?: boolean;
  data: T;
  message?: string;
  error?: string;
  generated_at?: string;
}

// ==================== Form Types ====================
export interface CreateAssignmentData {
  property_id: number;
  cs_agent_id: number;
  notes?: string;
  priority?: Priority;
  assigned_at?: string;
}

export interface UpdateAssignmentData {
  status: VerificationStatus;
  notes?: string;
  priority?: Priority;
}

export interface BulkAssignData {
  property_ids: number[];
  cs_agent_id: number;
  notes?: string;
  priority?: Priority;
}

export interface ReassignData {
  new_cs_agent_id: number;
  reason: string;
}

export interface UploadDocumentData {
  files: File[];
  document_type?: string;
  notes?: string;
}

// ==================== Verification Timeline Types ====================
export interface VerificationTimelineItem {
  id: number;
  action: string;
  description: string;
  user_name: string;
  user_role: string;
  timestamp: string;
  type:
    | "status_change"
    | "document_upload"
    | "note_added"
    | "assignment"
    | "completion"
    | string; // 'string' for flexibility if API has other types
  metadata?: {
    old_status?: string;
    new_status?: string;
    documents?: number;
    note?: string;
    [key: string]: any; // Allow for other metadata fields
  };
}

// ==================== Statistics Types ====================
export interface AssignmentStatistics {
  total_assignments: number;
  pending_assignments: number;
  in_progress_assignments: number;
  completed_assignments: number;
  rejected_assignments: number;
  average_completion_time: number;
  top_performing_agents: AgentPerformance[];
  assignments_by_status: StatusCount[];
  period: {
    from: string;
    to: string;
  };
}

// ==================== Notification Types ====================
export interface CsAgentNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  read?: boolean;
  autoClose?: boolean;
  duration?: number;
  timestamp?: string;
}

// ==================== Document Types ====================
export interface UploadedDocument {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
  document_type?: string;
  notes?: string;
}
