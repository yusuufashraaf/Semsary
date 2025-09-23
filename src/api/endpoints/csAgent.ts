import api from "@services/axios-global";
import type {
  ApiResponse,
  PaginatedResponse,
  CsAgentDashboard,
  PropertyAssignment,
  AssignmentFilters,
  UpdateAssignmentData,
  UploadedDocument,
  AssignmentStatistics,
  ChartData,
  PerformanceData,
  VerificationTimelineItem,
} from "@app-types/cs-agent/cs-agent";

export const csAgentApi = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get<ApiResponse<CsAgentDashboard>>(
      "/cs-agent/dashboard"
    );
    return response.data;
  },

  // Properties/Assignments
  getProperties: async (filters?: AssignmentFilters) => {
    const response = await api.get<PaginatedResponse<PropertyAssignment>>(
      "/cs-agent/properties",
      {
        params: filters,
      }
    );
    return response.data;
  },

  getPropertyDetails: async (propertyId: number) => {
    const response = await api.get<ApiResponse<PropertyAssignment>>(
      `/cs-agent/properties/${propertyId}`
    );
    return response.data;
  },

  // Verification Status
  updateVerificationStatus: async (
    propertyId: number,
    data: UpdateAssignmentData
  ) => {
    const response = await api.patch<ApiResponse<PropertyAssignment>>(
      `/cs-agent/properties/${propertyId}/status`,
      data
    );
    return response.data;
  },

  // Document Management
  uploadDocuments: async (
    propertyId: number,
    formData: FormData,
    config?: { onUploadProgress?: (progressEvent: any) => void }
  ) => {
    const response = await api.post<ApiResponse<UploadedDocument[]>>(
      `/cs-agent/properties/${propertyId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        ...config,
      }
    );
    return response.data;
  },

  getDocuments: async (propertyId: number) => {
    const response = await api.get<ApiResponse<VerificationTimelineItem[]>>(
      `/cs-agent/properties/${propertyId}/documents`
    );
    return response.data;
  },

  deleteDocument: async (propertyId: number, documentId: number) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/cs-agent/properties/${propertyId}/documents/${documentId}`
    );
    return response.data;
  },

  // Statistics & Analytics
  getStatistics: async (period?: string) => {
    const response = await api.get<ApiResponse<AssignmentStatistics>>(
      "/cs-agent/statistics",
      {
        params: { period },
      }
    );
    return response.data;
  },

  getAssignmentsChart: async (period: string = "7days") => {
    const response = await api.get<ApiResponse<ChartData>>(
      "/cs-agent/charts/assignments",
      {
        params: { period },
      }
    );
    return response.data;
  },

  getPerformanceChart: async (period: string = "30days") => {
    const response = await api.get<ApiResponse<PerformanceData>>(
      "/cs-agent/charts/performance",
      {
        params: { period },
      }
    );
    return response.data;
  },

  // Verification History/Timeline
  getVerificationTimeline: async (propertyId: number) => {
    const response = await api.get<ApiResponse<VerificationTimelineItem[]>>(
      `/cs-agent/properties/${propertyId}/timeline`
    );
    return response.data;
  },

  // Notes
  addNote: async (propertyId: number, note: string) => {
    const response = await api.post<ApiResponse<any>>(
      `/cs-agent/properties/${propertyId}/notes`,
      {
        note,
      }
    );
    return response.data;
  },

  // Profile
  getProfile: async () => {
    const response = await api.get<ApiResponse<any>>("/cs-agent/profile");
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put<ApiResponse<any>>("/cs-agent/profile", data);
    return response.data;
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
  }) => {
    const response = await api.post<ApiResponse<any>>(
      "/cs-agent/change-password",
      data
    );
    return response.data;
  },
};

// Helper functions for API responses
export const formatApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response.status === "error" || response.success === false) {
    throw new Error(response.message || response.error || "API request failed");
  }
  return response.data;
};
