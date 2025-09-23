/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/endpoints/admin.ts - Fixed response structure mapping
import api from "@services/axios-global";
import {
  DashboardStats,
  User,
  Property,
  Transaction,
  ApiResponse,
  PaginatedResponse,
  UserFilters,
  PropertyFilters,
  TransactionFilters,
} from "@app-types/admin/admin";

// Backend response structure (what the API actually returns)
interface BackendPaginatedResponse<T> {
  status: string;
  message: string;
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Safe filter serialization specifically for UserFilters
const createUserFilterParams = (
  page: number,
  limit: number,
  filters?: UserFilters
): URLSearchParams => {
  const params = new URLSearchParams();
  
  // Always include page and limit
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  // Only include defined filter values
  if (filters) {
    if (filters.role && typeof filters.role === 'string') {
      params.append('role', filters.role);
    }
    if (filters.status && typeof filters.status === 'string') {
      params.append('status', filters.status);
    }
    if (filters.search && typeof filters.search === 'string') {
      params.append('search', filters.search);
    }
    if (filters.date_from && typeof filters.date_from === 'string') {
      params.append('date_from', filters.date_from);
    }
    if (filters.date_to && typeof filters.date_to === 'string') {
      params.append('date_to', filters.date_to);
    }
    if (filters.sort_by && typeof filters.sort_by === 'string') {
      params.append('sort_by', filters.sort_by);
    }
    if (filters.sort_order && typeof filters.sort_order === 'string') {
      params.append('sort_order', filters.sort_order);
    }
    if (filters.per_page && (typeof filters.per_page === 'number' || typeof filters.per_page === 'string')) {
      params.append('per_page', String(filters.per_page));
    }
  }
  
  return params;
};

// Safe helper function to create URLSearchParams with proper serialization
const createSearchParams = (obj: Record<string, any>): URLSearchParams => {
  const params = new URLSearchParams();
  
  Object.entries(obj).forEach(([key, value]) => {
    // Skip undefined, null, and empty string values
    if (value === undefined || value === null || value === '') {
      return;
    }
    
    // Handle different types of values safely
    let stringValue: string;
    
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      stringValue = String(value);
    } else if (value instanceof Date) {
      stringValue = value.toISOString();
    } else if (Array.isArray(value)) {
      // Convert arrays to comma-separated strings
      stringValue = value.join(',');
    } else if (typeof value === 'object') {
      // For objects, only include primitive properties and avoid circular references
      try {
        // Only include primitive values from objects
        const primitiveValue = Object.fromEntries(
          Object.entries(value).filter(([_, v]) => 
            typeof v === 'string' || 
            typeof v === 'number' || 
            typeof v === 'boolean' ||
            v instanceof Date
          )
        );
        stringValue = JSON.stringify(primitiveValue);
      } catch (error) {
        // If serialization fails, skip this parameter
        console.warn(`Failed to serialize parameter ${key}:`, error);
        return;
      }
    } else {
      // For any other type, convert to string or skip
      try {
        stringValue = String(value);
      } catch (error) {
        console.warn(`Failed to convert parameter ${key} to string:`, error);
        return;
      }
    }
    
    params.append(key, stringValue);
  });
  
  return params;
};

// Helper function to transform backend pagination response to frontend format
const transformPaginatedResponse = <T>(backendResponse: BackendPaginatedResponse<T>): PaginatedResponse<T> => {
  return {
    data: backendResponse.data,
    current_page: backendResponse.pagination.current_page,
    last_page: backendResponse.pagination.last_page,
    per_page: backendResponse.pagination.per_page,
    total: backendResponse.pagination.total,
    from: ((backendResponse.pagination.current_page - 1) * backendResponse.pagination.per_page) + 1,
    to: Math.min(
      backendResponse.pagination.current_page * backendResponse.pagination.per_page, 
      backendResponse.pagination.total
    ),
  };
};

// Dashboard API endpoints
export const dashboardApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>(
      "/admin/dashboard/stats"
    );
    return response.data.data;
  },

  // Get revenue chart data
  getRevenueChart: async () => {
    const response = await api.get(`/admin/dashboard/charts/revenue`);
    return response.data.data;
  },

  // Get users chart data
  getUsersChart: async () => {
    const response = await api.get(`/admin/dashboard/charts/users`);
    return response.data.data;
  },

  // Get properties chart data
  getPropertiesChart: async () => {
    const response = await api.get(`/admin/dashboard/charts/properties`);
    return response.data.data;
  },
};

// Users API endpoints
export const usersApi = {
  // Get paginated users list with filters - FIXED response structure mapping
  getUsers: async (
    page: number = 1,
    limit: number = 10,
    filters?: UserFilters
  ): Promise<PaginatedResponse<User>> => {
    const params = createUserFilterParams(page, limit, filters);

    const response = await api.get<BackendPaginatedResponse<User>>(
      `/admin/users?${params}`
    );
    
    // Transform the backend response to match frontend expectations
    return transformPaginatedResponse(response.data);
  },

  // Get single user details
  getUser: async (id: number): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
    return response.data.data;
  },

  // Update user
  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(
      `/admin/users/${id}`,
      data
    );
    return response.data.data;
  },

  // Activate user
  activateUser: async (id: number): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(
      `/admin/users/${id}/activate`
    );
    return response.data.data;
  },

  // Deactivate user
  deactivateUser: async (id: number): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(
      `/admin/users/${id}/deactivate`
    );
    return response.data.data;
  },

  // Suspend user
  suspendUser: async (id: number): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(
      `/admin/users/${id}/suspend`
    );
    return response.data.data;
  },

  // Get user transactions
  getUserTransactions: async (id: number): Promise<Transaction[]> => {
    const response = await api.get<ApiResponse<Transaction[]>>(
      `/admin/users/${id}/transactions`
    );
    return response.data.data;
  },

  // Get user properties
  getUserProperties: async (id: number): Promise<Property[]> => {
    const response = await api.get<ApiResponse<Property[]>>(
      `/admin/users/${id}/properties`
    );
    return response.data.data;
  },

  // Bulk actions
  bulkActivateUsers: async (userIds: number[]): Promise<void> => {
    await api.patch("/admin/users/bulk/activate", { user_ids: userIds });
  },

  bulkDeactivateUsers: async (userIds: number[]): Promise<void> => {
    await api.patch("/admin/users/bulk/deactivate", { user_ids: userIds });
  },

  bulkSuspendUsers: async (userIds: number[]): Promise<void> => {
    await api.patch("/admin/users/bulk/suspend", { user_ids: userIds });
  },

  // Search users
  searchUsers: async (query: string, filters?: UserFilters): Promise<User[]> => {
    const params = createSearchParams({ search: query, ...filters });
    const response = await api.get<ApiResponse<User[]>>(`/admin/users/search?${params}`);
    return response.data.data;
  },

  // Get user statistics
  getUserStatistics: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/admin/users/statistics');
    return response.data.data;
  },

  // Get users requiring attention
  getUsersRequiringAttention: async (type?: string, limit = 20): Promise<User[]> => {
    const params = createSearchParams({ type, limit });
    const response = await api.get<ApiResponse<User[]>>(`/admin/users/requires-attention?${params}`);
    return response.data.data;
  },

  // Get user activity
  getUserActivity: async (id: number): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(`/admin/users/${id}/activity`);
    return response.data.data;
  },

  // Block user
  blockUser: async (id: number): Promise<User> => {
    const response = await api.post<ApiResponse<User>>(`/admin/users/${id}/block`);
    return response.data.data;
  },

  // Unblock user
  unblockUser: async (id: number): Promise<User> => {
    const response = await api.post<ApiResponse<User>>(`/admin/users/${id}/unblock`);
    return response.data.data;
  },
};

// Properties API endpoints
export const propertiesApi = {
  // Get paginated properties list with filters
  getProperties: async (
    page: number = 1,
    limit: number = 10,
    filters?: PropertyFilters
  ): Promise<PaginatedResponse<Property>> => {
    const params = createSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await api.get<BackendPaginatedResponse<Property>>(
      `/admin/properties?${params}`
    );
    
    // Transform the backend response to match frontend expectations
    return transformPaginatedResponse(response.data);
  },

  // Get single property details
  getProperty: async (id: number): Promise<Property> => {
    const response = await api.get<ApiResponse<Property>>(
      `/admin/properties/${id}`
    );
    return response.data.data;
  },

  // Approve property
  approveProperty: async (id: number, notes?: string): Promise<Property> => {
    const response = await api.patch<ApiResponse<Property>>(
      `/admin/properties/${id}/approve`,
      { notes }
    );
    return response.data.data;
  },

  // Reject property
  rejectProperty: async (id: number, reason: string): Promise<Property> => {
    const response = await api.patch<ApiResponse<Property>>(
      `/admin/properties/${id}/reject`,
      { reason }
    );
    return response.data.data;
  },

  // Assign property to CS agent
  assignToCS: async (
    propertyId: number,
    csAgentId: number
  ): Promise<Property> => {
    const response = await api.patch<ApiResponse<Property>>(
      `/admin/properties/${propertyId}/assign`,
      {
        cs_agent_id: csAgentId,
      }
    );
    return response.data.data;
  },

  // Get properties pending verification
  getPendingVerification: async (): Promise<Property[]> => {
    const response = await api.get<ApiResponse<Property[]>>(
      "/admin/properties/pending-verification"
    );
    return response.data.data;
  },

  // Get CS agents for assignment
  getCSAgents: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>("/admin/cs-agents");
    return response.data.data;
  },

  // Bulk actions
  bulkApproveProperties: async (
    propertyIds: number[],
    notes?: string
  ): Promise<void> => {
    await api.patch("/admin/properties/bulk/approve", {
      property_ids: propertyIds,
      notes,
    });
  },

  bulkRejectProperties: async (
    propertyIds: number[],
    reason: string
  ): Promise<void> => {
    await api.patch("/admin/properties/bulk/reject", {
      property_ids: propertyIds,
      reason,
    });
  },

  // Search properties
  searchProperties: async (query: string, filters?: PropertyFilters): Promise<Property[]> => {
    const params = createSearchParams({ search: query, ...filters });
    const response = await api.get<ApiResponse<Property[]>>(`/admin/properties/search?${params}`);
    return response.data.data;
  },

  // Get property statistics
  getPropertyStatistics: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/admin/properties/statistics');
    return response.data.data;
  },

  // Get properties requiring attention
  getPropertiesRequiringAttention: async (type?: string, limit = 20): Promise<Property[]> => {
    const params = createSearchParams({ type, limit });
    const response = await api.get<ApiResponse<Property[]>>(`/admin/properties/requires-attention?${params}`);
    return response.data.data;
  },

  // Delete property
  deleteProperty: async (id: number): Promise<void> => {
    await api.delete(`/admin/properties/${id}`);
  },
};

// Transactions API endpoints
export const transactionsApi = {
  // Get paginated transactions list with filters
  getTransactions: async (
    page: number = 1,
    limit: number = 10,
    filters?: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> => {
    const params = createSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await api.get<BackendPaginatedResponse<Transaction>>(
      `/admin/transactions?${params}`
    );
    
    // Transform the backend response to match frontend expectations
    return transformPaginatedResponse(response.data);
  },

  // Get single transaction details
  getTransaction: async (id: number): Promise<Transaction> => {
    const response = await api.get<ApiResponse<Transaction>>(
      `/admin/transactions/${id}`
    );
    return response.data.data;
  },

  // Refund transaction
  refundTransaction: async (
    id: number,
    reason: string,
    amount?: number
  ): Promise<Transaction> => {
    const response = await api.patch<ApiResponse<Transaction>>(
      `/admin/transactions/${id}/refund`,
      {
        reason,
        amount,
      }
    );
    return response.data.data;
  },

  // Export transactions
  exportTransactions: async (
    format: "csv" | "xlsx" | "pdf",
    filters?: TransactionFilters
  ): Promise<Blob> => {
    const params = createSearchParams({
      format,
      ...filters,
    });

    const response = await api.get(`/admin/transactions/export?${params}`, {
      responseType: "blob",
    });
    return response.data;
  },

  // Get transaction summary for financial overview
  getTransactionSummary: async (period?: string) => {
    const params = period ? `?period=${period}` : "";
    const response = await api.get(`/admin/transactions/summary${params}`);
    return response.data.data;
  },

  // Get transaction statistics
  getTransactionStats: async (dateFrom?: string, dateTo?: string) => {
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);

    const response = await api.get(`/admin/transactions/stats?${params}`);
    return response.data.data;
  },
};

// General admin endpoints
export const adminApi = {
  // Get admin profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>("/admin/profile");
    return response.data.data;
  },

  // Update admin profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>("/admin/profile", data);
    return response.data.data;
  },

  // Get system settings
  getSettings: async () => {
    const response = await api.get("/admin/settings");
    return response.data.data;
  },

  // Update system settings
  updateSettings: async (settings: Record<string, any>) => {
    const response = await api.put("/admin/settings", settings);
    return response.data.data;
  },

  // Get audit logs
  getAuditLogs: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(
      `/admin/audit-logs?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  // Search users, properties, transactions
  globalSearch: async (
    query: string,
    type?: "users" | "properties" | "transactions"
  ) => {
    const params = new URLSearchParams({ query });
    if (type) params.append("type", type);

    const response = await api.get(`/admin/search?${params}`);
    return response.data.data;
  },
};