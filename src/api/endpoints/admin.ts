/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/endpoints/admin.ts
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

// Helper function to create URLSearchParams
const createSearchParams = (obj: Record<string, any>): URLSearchParams => {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  return params;
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
  // Get paginated users list with filters
  getUsers: async (
    page: number = 1,
    limit: number = 10,
    filters?: UserFilters
  ): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await api.get<ApiResponse<PaginatedResponse<User>>>(
      `/admin/users?${params}`
    );
    return response.data.data;
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

    const response = await api.get<ApiResponse<PaginatedResponse<Property>>>(
      `/admin/properties?${params}`
    );
    return response.data.data;
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

    const response = await api.get<ApiResponse<PaginatedResponse<Transaction>>>(
      `/admin/transactions?${params}`
    );
    return response.data.data;
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
