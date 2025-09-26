/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/endpoints/users.ts - Corrected to match actual backend routes
import api from "@services/axios-global";
import {
  ApiResponse,
  PaginatedResponse,
  UserFilters,
} from "@app-types/admin/admin";
import { TFullUser } from "@app-types/users/users.types";

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

// Helper function to create URLSearchParams
const createSearchParams = (obj: Record<string, any>): URLSearchParams => {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
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

// Users API endpoints - Based on actual backend routes
export const usersApi = {
  // Get paginated users list with comprehensive filtering
  // ✅ AVAILABLE: GET /admin/users
  getUsers: async (
    page: number = 1,
    perPage: number = 15,
    filters?: UserFilters
  ): Promise<PaginatedResponse<TFullUser>> => {
    const params = createSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      role: filters?.role,
      status: filters?.status,
      search: filters?.search,
      sort_by: filters?.sort_by || 'created_at',
      sort_order: filters?.sort_order || 'desc',
      date_from: filters?.date_from,
      date_to: filters?.date_to,
    });

    const response = await api.get<BackendPaginatedResponse<TFullUser>>(
      `/admin/users?${params}`
    );
    
    // Transform the backend response to match frontend expectations
    return transformPaginatedResponse(response.data);
  },

  // Get single user details with comprehensive information
  // ✅ AVAILABLE: GET /admin/users/{id}
  getUser: async (id: number): Promise<TFullUser> => {
    const response = await api.get<ApiResponse<TFullUser>>(`/admin/users/${id}`);
    return response.data.data;
  },

  // Activate user account with reason logging
  // ✅ AVAILABLE: POST /admin/users/{id}/activate
  activateUser: async (id: number, reason?: string): Promise<TFullUser> => {
    const response = await api.post<ApiResponse<TFullUser>>(
      `/admin/users/${id}/activate`,
      { reason: reason || "User account activated by admin" }
    );
    return response.data.data;
  },

  // Suspend user account temporarily with reason logging
  // ✅ AVAILABLE: POST /admin/users/{id}/suspend
  suspendUser: async (id: number, reason: string): Promise<TFullUser> => {
    const response = await api.post<ApiResponse<TFullUser>>(
      `/admin/users/${id}/suspend`,
      { reason }
    );
    return response.data.data;
  },

  // Get user activity/admin actions history
  // ✅ AVAILABLE: GET /admin/users/{id}/activity
  getUserActivity: async (id: number) => {
    const response = await api.get(`/admin/users/${id}/activity`);
    return response.data.data;
  },

  // Search users by name, email, or phone number
  // ✅ AVAILABLE: GET /admin/users/search
  searchUsers: async (term: string, limit: number = 10) => {
    const params = createSearchParams({
      q: term, // Assuming the backend expects 'q' parameter for search query
      limit: limit.toString(),
    });

    const response = await api.get(`/admin/users/search?${params}`);
    return response.data.data;
  },

  // Get comprehensive user statistics for admin dashboard
  // ✅ AVAILABLE: GET /admin/users/statistics
  getUserStatistics: async () => {
    const response = await api.get('/admin/users/statistics');
    return response.data.data;
  },

  // Get count of users requiring admin attention
  // ✅ AVAILABLE: GET /admin/users/requires-attention
  getUsersRequiringAttention: async () => {
    const response = await api.get('/admin/users/requires-attention');
    return response.data.data;
  },

  // REMOVED: Export functionality - not available in backend
  // REMOVED: Bulk operations - not available in backend
  // REMOVED: getUserTransactions - not available in backend
  // REMOVED: getUserProperties - not available in backend
};