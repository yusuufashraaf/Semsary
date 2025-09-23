// src/hooks/admin/useAdminCsAgentQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCsAgentApi } from '@api/endpoints/admin/csAgents';
import type {
  CsAgent,
  PropertyAssignment,
  AssignmentFilters,
  CreateAssignmentData,
  UpdateAssignmentData,
  BulkAssignData,
  ReassignData,
} from '@app-types/cs-agent/cs-agent';

// CS Agent Management Hooks
export const useAdminCsAgents = (page = 1, per_page = 15, filters = {}) => {
  return useQuery({
    queryKey: ['admin', 'cs-agents', 'list', { page, per_page, ...filters }],
    queryFn: () => adminCsAgentApi.getCsAgents(page, per_page, filters),
  });
};

export const useAdminCsAgent = (id: number) => {
  return useQuery({
    queryKey: ['admin', 'cs-agents', 'detail', id],
    queryFn: () => adminCsAgentApi.getCsAgent(id),
    enabled: !!id,
  });
};

// Dashboard and Analytics Hooks
export const useAdminCsAgentDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'cs-agents', 'dashboard'],
    queryFn: adminCsAgentApi.getDashboardData,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useAdminAssignmentsChart = (period = '30days') => {
  return useQuery({
    queryKey: ['admin', 'cs-agents', 'charts', 'assignments', period],
    queryFn: () => adminCsAgentApi.getAssignmentsChart(period),
  });
};

export const useAdminPerformanceChart = (period = '30days') => {
  return useQuery({
    queryKey: ['admin', 'cs-agents', 'charts', 'performance', period],
    queryFn: () => adminCsAgentApi.getAgentPerformanceChart(period),
  });
};

export const useAdminWorkloadChart = () => {
  return useQuery({
    queryKey: ['admin', 'cs-agents', 'charts', 'workload'],
    queryFn: adminCsAgentApi.getWorkloadChart,
  });
};

export const useAdminAttentionItems = (type?: string, limit = 20) => {
  return useQuery({
    queryKey: ['admin', 'cs-agents', 'attention', { type, limit }],
    queryFn: () => adminCsAgentApi.getAssignmentsRequiringAttention(type as any, limit),
    refetchInterval: 60000, // Refresh every minute
  });
};

// Assignment Management Hooks
export const useAdminAssignments = (filters?: AssignmentFilters) => {
  return useQuery({
    queryKey: ['admin', 'cs-agents', 'assignments', filters],
    queryFn: () => adminCsAgentApi.getAssignments(filters),
  });
};

export const useAdminAssignment = (id: number) => {
  return useQuery({
    queryKey: ['admin', 'cs-agents', 'assignments', 'detail', id],
    queryFn: () => adminCsAgentApi.getAssignment(id),
    enabled: !!id,
  });
};

export const useAdminAssignmentStatistics = (date_from?: string, date_to?: string) => {
  return useQuery({
    queryKey: ['admin', 'cs-agents', 'assignments', 'statistics', { date_from, date_to }],
    queryFn: () => adminCsAgentApi.getAssignmentStatistics(date_from, date_to),
  });
};

export const useAdminAvailableAgents = () => {
  return useQuery({
    queryKey: ['admin', 'cs-agents', 'available'],
    queryFn: adminCsAgentApi.getAvailableAgents,
  });
};

// Mutation Hooks
export const useUpdateCsAgent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CsAgent> }) =>
      adminCsAgentApi.updateCsAgent(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents'] });
      queryClient.setQueryData(['admin', 'cs-agents', 'detail', variables.id], data);
    },
  });
};

export const useActivateCsAgent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => adminCsAgentApi.activateCsAgent(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents'] });
      queryClient.setQueryData(['admin', 'cs-agents', 'detail', id], data);
    },
  });
};

export const useSuspendCsAgent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => adminCsAgentApi.suspendCsAgent(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents'] });
      queryClient.setQueryData(['admin', 'cs-agents', 'detail', id], data);
    },
  });
};

export const useBlockCsAgent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => adminCsAgentApi.blockCsAgent(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents'] });
      queryClient.setQueryData(['admin', 'cs-agents', 'detail', id], data);
    },
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateAssignmentData) => adminCsAgentApi.createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'assignments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'dashboard'] });
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAssignmentData }) =>
      adminCsAgentApi.updateAssignment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'assignments'] });
      queryClient.setQueryData(['admin', 'cs-agents', 'assignments', 'detail', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'dashboard'] });
    },
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => adminCsAgentApi.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'assignments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'dashboard'] });
    },
  });
};

export const useReassignAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReassignData }) =>
      adminCsAgentApi.reassignAssignment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'assignments'] });
      queryClient.setQueryData(['admin', 'cs-agents', 'assignments', 'detail', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'dashboard'] });
    },
  });
};

export const useBulkAssignProperties = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: BulkAssignData) => adminCsAgentApi.bulkAssignProperties(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'assignments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'dashboard'] });
    },
  });
};