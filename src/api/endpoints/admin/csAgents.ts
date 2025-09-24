import api from "@services/axios-global";
import type { 
  CsAgent, 
  PropertyAssignment, 
  AssignmentStatistics,
  ApiResponse,
  PaginatedResponse 
} from '@app-types/cs-agent/cs-agent';

// Laravel-style API response structure
interface LaravelPaginatedResponse<T> {
  success: boolean;
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

// Helper function to create search params
const createSearchParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

export const adminCsAgentApi = {
  // ==================== CS Agent Management ====================
  
  // Get all CS agents with pagination support
  getAllAgents: async (page = 1, per_page = 15, filters = {}): Promise<PaginatedResponse<CsAgent>> => {
    const params = createSearchParams({ page, per_page, ...filters });
    const response = await api.get<LaravelPaginatedResponse<CsAgent>>(`/admin/cs-agents?${params}`);
    
    // Transform Laravel response to our expected format
    return {
      status: "success",
      data: response.data.data,
      pagination: {
        current_page: response.data.meta.current_page,
        last_page: response.data.meta.last_page,
        per_page: response.data.meta.per_page,
        total: response.data.meta.total,
        from: response.data.meta.from,
        to: response.data.meta.to,
      }
    };
  },
  
  // Alias for backward compatibility
  getCsAgents: async (page = 1, per_page = 15, filters = {}): Promise<PaginatedResponse<CsAgent>> => {
    return adminCsAgentApi.getAllAgents(page, per_page, filters);
  },

  // Get CS agent by ID
  getAgent: async (agentId: number): Promise<CsAgent> => {
    const response = await api.get<ApiResponse<CsAgent>>(`/admin/cs-agents/${agentId}`);
    return response.data.data;
  },
  
  // Alias for backward compatibility
  getCsAgent: async (agentId: number): Promise<CsAgent> => {
    return adminCsAgentApi.getAgent(agentId);
  },

  // Create new CS agent
  createAgent: async (agentData: Partial<CsAgent>): Promise<CsAgent> => {
    const response = await api.post<ApiResponse<CsAgent>>('/admin/cs-agents', agentData);
    return response.data.data;
  },
  
  // CS Agent status management
  activateCsAgent: async (id: number): Promise<CsAgent> => {
    const response = await api.post<ApiResponse<CsAgent>>(`/admin/cs-agents/${id}/activate`);
    return response.data.data;
  },
  
  suspendCsAgent: async (id: number): Promise<CsAgent> => {
    const response = await api.post<ApiResponse<CsAgent>>(`/admin/cs-agents/${id}/suspend`);
    return response.data.data;
  },
  
  blockCsAgent: async (id: number): Promise<CsAgent> => {
    const response = await api.post<ApiResponse<CsAgent>>(`/admin/cs-agents/${id}/block`);
    return response.data.data;
  },

  // Update CS agent
  updateAgent: async (agentId: number, agentData: Partial<CsAgent>): Promise<CsAgent> => {
    const response = await api.put<ApiResponse<CsAgent>>(`/admin/cs-agents/${agentId}`, agentData);
    return response.data.data;
  },
  
  // Alias for backward compatibility
  updateCsAgent: async (agentId: number, agentData: Partial<CsAgent>): Promise<CsAgent> => {
    return adminCsAgentApi.updateAgent(agentId, agentData);
  },

  // Delete CS agent
  deleteAgent: async (agentId: number): Promise<void> => {
    await api.delete(`/admin/cs-agents/${agentId}`);
  },

  // ==================== Assignment Management ====================
  
  // Get all assignments with filters
  getAssignments: async (filters?: {
    status?: string;
    agent_id?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
  }): Promise<PaginatedResponse<PropertyAssignment>> => {
    const params = createSearchParams(filters || {});
    const response = await api.get<PaginatedResponse<PropertyAssignment>>(`/admin/cs-agents/assignments?${params}`);
    return response.data;
  },
  
  // Alias for backward compatibility
  getAllAssignments: async (filters?: {
    status?: string;
    agent_id?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
  }): Promise<PaginatedResponse<PropertyAssignment>> => {
    const params = createSearchParams(filters || {});
    const response = await api.get<PaginatedResponse<PropertyAssignment>>(`/admin/cs-agents/assignments?${params}`);
    return response.data;
  },

  // Create a new assignment
  createAssignment: async (data: {
    property_id: number;
    cs_agent_id: number;
    priority?: string;
    notes?: string;
  }): Promise<PropertyAssignment> => {
    const response = await api.post<ApiResponse<PropertyAssignment>>('/admin/cs-agents/assignments', data);
    return response.data.data;
  },
  
  // Alias for backward compatibility
  assignProperty: async (data: {
    property_id: number;
    cs_agent_id: number;
    priority?: string;
    notes?: string;
  }): Promise<PropertyAssignment> => {
    const response = await api.post<ApiResponse<PropertyAssignment>>('/admin/cs-agents/assignments', data);
    return response.data.data;
  },

  // Bulk assign properties
  bulkAssignProperties: async (data: {
    property_ids: number[];
    cs_agent_id: number;
    priority?: string;
  }): Promise<{
    assigned_properties: { id: number; title: string }[];
    non_assignable_properties: { id: number; title: string; reason: string }[];
    cs_agent: { id: number; name: string; email: string };
  }> => {
    const response = await api.post<{
      status: string;
      data: {
        assigned_properties: { id: number; title: string }[];
        non_assignable_properties: { id: number; title: string; reason: string }[];
        cs_agent: { id: number; name: string; email: string };
      };
    }>('/admin/cs-agents/assignments/bulk-assign', data);
    
    return response.data.data;
  },

  // ==================== Utility Functions ====================
  
  // Get assignment statistics
  getAssignmentStatistics: async (
    date_from?: string,
    date_to?: string
  ): Promise<AssignmentStatistics> => {
    const params = createSearchParams({ date_from, date_to });
    
    const response = await api.get<{
      status: string;
      data: AssignmentStatistics;
      period: {
        from: string;
        to: string;
      };
    }>(`/admin/cs-agents/assignments/statistics?${params}`);
    
    return response.data.data;
  },

  // Get available CS agents for assignment
  getAvailableAgents: async (): Promise<CsAgent[]> => {
    const response = await api.get<{
      status: string;
      data: CsAgent[];
    }>('/admin/cs-agents/assignments/available-agents');
    
    return response.data.data;
  },

  // Reassign property to another CS agent
  reassignProperty: async (assignmentId: number, newAgentId: number): Promise<PropertyAssignment> => {
    const response = await api.post<ApiResponse<PropertyAssignment>>(
      `/admin/cs-agents/assignments/${assignmentId}/reassign`,
      { cs_agent_id: newAgentId }
    );
    return response.data.data;
  },
  
  // Alias with more generic interface
  reassignAssignment: async (assignmentId: number, data: { cs_agent_id: number }): Promise<PropertyAssignment> => {
    return adminCsAgentApi.reassignProperty(assignmentId, data.cs_agent_id);
  },

  // Get assignment details
  getAssignment: async (assignmentId: number): Promise<PropertyAssignment> => {
    const response = await api.get<ApiResponse<PropertyAssignment>>(`/admin/cs-agents/assignments/${assignmentId}`);
    return response.data.data;
  },

  // Update assignment
  updateAssignment: async (assignmentId: number, data: Partial<PropertyAssignment>): Promise<PropertyAssignment> => {
    const response = await api.put<ApiResponse<PropertyAssignment>>(`/admin/cs-agents/assignments/${assignmentId}`, data);
    return response.data.data;
  },

  // Delete assignment
  deleteAssignment: async (assignmentId: number): Promise<void> => {
    await api.delete(`/admin/cs-agents/assignments/${assignmentId}`);
  },

  // ==================== Dashboard & Analytics ====================
  
  // Get CS agent dashboard data
  getDashboardData: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/admin/cs-agents/dashboard');
    return response.data.data;
  },
  
  // Get assignments requiring attention
  getAssignmentsRequiringAttention: async (type?: 'overdue' | 'high-priority' | 'stalled', limit = 20): Promise<PropertyAssignment[]> => {
    const params = createSearchParams({ type, limit });
    const response = await api.get<ApiResponse<PropertyAssignment[]>>(`/admin/cs-agents/dashboard/attention?${params}`);
    return response.data.data;
  },
  
  // Chart Data Methods
  getAssignmentsChart: async (period = '30days'): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(`/admin/cs-agents/dashboard/charts/assignments?period=${period}`);
    return response.data.data;
  },
  
  getAgentPerformanceChart: async (period = '30days'): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(`/admin/cs-agents/dashboard/charts/performance?period=${period}`);
    return response.data.data;
  },
  
  getWorkloadChart: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/admin/cs-agents/dashboard/charts/workload');
    return response.data.data;
  },
};

// Helper functions for API response handling
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

export const handleApiResponse = <T>(response: { status: string; data: T }): T => {
  if (response.status === "error") {
    throw new Error("API request failed");
  }
  return response.data;
};