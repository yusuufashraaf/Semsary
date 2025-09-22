// src/hooks/usePropertiesQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesApi } from '@api/endpoints/properties';
import { toast } from 'react-toastify';

// Clean function to serialize filters for query key
const serializeFilters = (filters: any) => {
  if (!filters) return null;
  
  // Only include primitive values, exclude DOM elements and functions
  const cleanFilters: any = {};
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (
      value !== undefined && 
      value !== null && 
      value !== '' &&
      typeof value !== 'function' &&
      typeof value !== 'object' ||
      (typeof value === 'object' && value.constructor === Object)
    ) {
      cleanFilters[key] = value;
    }
  });
  
  return Object.keys(cleanFilters).length > 0 ? cleanFilters : null;
};

// Query keys with serializable data only
export const PROPERTIES_QUERY_KEYS = {
  LIST: (page: number, limit: number, filters?: any) => [
    'admin', 
    'properties', 
    'list', 
    page, 
    limit, 
    serializeFilters(filters)
  ] as const,
  DETAIL: (id: number) => ['admin', 'properties', 'detail', id] as const,
  STATISTICS: ['admin', 'properties', 'statistics'] as const,
  SEARCH: (query: string, type: string) => ['admin', 'properties', 'search', query, type] as const,
  REQUIRES_ATTENTION: ['admin', 'properties', 'requires-attention'] as const,
  CS_AGENTS: ['admin', 'cs-agents'] as const,
} as const;

// Main properties list query hook
export const useProperties = (
  page: number = 1,
  limit: number = 15,
  filters?: any
) => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.LIST(page, limit, filters),
    queryFn: () => propertiesApi.getProperties(page, limit, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
    retry: 2,
  });
};

// Single property detail query hook
export const useProperty = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.DETAIL(id),
    queryFn: () => propertiesApi.getProperty(id),
    enabled: enabled && id > 0,
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });
};

// Properties statistics query hook
export const usePropertiesStatistics = () => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.STATISTICS,
    queryFn: () => propertiesApi.getStatistics(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// CS Agents query hook for assignment
export const useCSAgents = () => {
  return useQuery({
    queryKey: PROPERTIES_QUERY_KEYS.CS_AGENTS,
    queryFn: () => propertiesApi.getCSAgents(),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Property mutation hooks
export const usePropertyMutations = () => {
  const queryClient = useQueryClient();

  // Update property status mutation
  const updateStatus = useMutation({
    mutationFn: ({ id, status, data }: { 
      id: number; 
      status: 'Valid' | 'Invalid' | 'Pending' | 'Rented' | 'Sold';
      data: any;
    }) => propertiesApi.updatePropertyStatus(id, status, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'properties'],
      });
      toast.success('Property status updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update property status';
      toast.error(message);
    },
  });

  // Assign to CS agent mutation - Updated for new API format
  const assignToCS = useMutation({
    mutationFn: ({ propertyId, data }: { 
      propertyId: number; 
      data: {
        cs_agent_id: number;
        priority: 'low' | 'medium' | 'high';
        due_date: string;
        assignment_type: 'verification' | 'inspection' | 'follow_up';
        notes?: string;
      }
    }) => propertiesApi.assignToCSAgent(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'properties'],
      });
      queryClient.invalidateQueries({
        queryKey: PROPERTIES_QUERY_KEYS.CS_AGENTS,
      });
      toast.success('Property assigned to CS agent successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to assign property to CS agent';
      toast.error(message);
    },
  });

  // Bulk approve mutation
  const bulkApprove = useMutation({
    mutationFn: ({ property_ids, reason }: { property_ids: number[]; reason?: string }) =>
      propertiesApi.bulkApprove(property_ids, reason),
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'properties'],
      });
      toast.success(`Successfully approved ${result.success_count || result.property_ids.length} properties`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to approve properties';
      toast.error(message);
    },
  });

  // Bulk reject mutation
  const bulkReject = useMutation({
    mutationFn: ({ property_ids, reason }: { property_ids: number[]; reason: string }) =>
      propertiesApi.bulkReject(property_ids, reason),
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'properties'],
      });
      toast.success(`Successfully rejected ${result.success_count || result.property_ids.length} properties`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to reject properties';
      toast.error(message);
    },
  });

  return {
    updateStatus,
    assignToCS,
    bulkApprove,
    bulkReject,
  };
};