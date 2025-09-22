/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAdminQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {dashboardApi, usersApi, propertiesApi, transactionsApi} from "@api/endpoints/admin";
import { QUERY_KEYS } from "@app-types/admin/admin";
import { useNotifications } from "@store/admin/adminStore";
import { handleQueryError } from "@lib/queryClient";
import type { PaginatedResponse, User, UserFilters } from '@app-types/admin/admin';

const STALE_TIME = 30 * 1000; // 30 seconds (dashboard stats change frequently)
const REFRESH_INTERVAL = 60 * 1000; // Refetch every 1 minute
const PENDING_VERIFICATION_REFRESH = 10 * 1000; // Refetch every 2 minutes
const AGENTS_STALE_TIME = 10 * 60 * 1000; // 10 minutes (agents don't change often)
const TRANSACTION_DETAIL_STALE_TIME = 1 * 60 * 1000; // 1 minute
const TRANSACTION_SUMMARY_STALE_TIME = 2 * 60 * 1000; // 2 minutes

// Dashboard Queries
export const useDashboardStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.STATS,
    queryFn: dashboardApi.getDashboardStats,
    staleTime: STALE_TIME, 
    refetchInterval: REFRESH_INTERVAL,
  });
};

export const useRevenueChart = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.REVENUE_CHART,
    queryFn: dashboardApi.getRevenueChart,
    staleTime: STALE_TIME,
  });
};

export const useUsersChart = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.USER_CHART,
    queryFn: dashboardApi.getUsersChart,
    staleTime: STALE_TIME,
  });
};

export const usePropertiesChart = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.PROPERTY_CHART,
    queryFn: dashboardApi.getPropertiesChart,
    staleTime: STALE_TIME,
  });
};

// User Queries
export const useUsers = (
  page: number = 1,
  limit: number = 10,
  filters?: UserFilters
) => {
  return useQuery<PaginatedResponse<User>>({
    queryKey: QUERY_KEYS.USERS.LIST(filters),
    queryFn: () => usersApi.getUsers(page, limit, filters),
    staleTime: STALE_TIME,
  });
};

export const useUser = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.DETAIL(id),
    queryFn: () => usersApi.getUser(id),
    enabled: enabled && !!id,
    staleTime: STALE_TIME, // 30 seconds instead of 2 minutes (user details change frequently)
  });
};

export const useUserTransactions = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.TRANSACTIONS(id),
    queryFn: () => usersApi.getUserTransactions(id),
    enabled: enabled && !!id,
    staleTime: STALE_TIME, // 30 seconds instead of 1 minute (user transactions change frequently)
  });
};

export const useUserProperties = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.PROPERTIES(id),
    queryFn: () => usersApi.getUserProperties(id),
    enabled: enabled && !!id,
    staleTime: STALE_TIME, // 30 seconds instead of 2 minutes (user properties change frequently)
  });
};

// Property Queries
export const useProperties = (
  page: number = 1,
  limit: number = 10,
  filters?: any
) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROPERTIES.LIST(filters),
    queryFn: () => propertiesApi.getProperties(page, limit, filters),
    staleTime: STALE_TIME, // 30 seconds instead of 30 seconds (properties list changes frequently)
    // @ts-expect-error: keepPreviousData is not in the type but is supported by react-query for pagination
    keepPreviousData: true,
  });
};

export const useProperty = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROPERTIES.DETAIL(id),
    queryFn: () => propertiesApi.getProperty(id),
    enabled: enabled && !!id,
    staleTime: STALE_TIME, // 30 seconds instead of 2 minutes (property details change frequently)
  });
};

export const usePendingVerification = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PROPERTIES.PENDING_VERIFICATION,
    queryFn: propertiesApi.getPendingVerification,
    staleTime: STALE_TIME, // 30 seconds instead of 1 minute (pending verification change frequently)
    refetchInterval: PENDING_VERIFICATION_REFRESH, // Refetch every 2 minutes
  });
};

export const useCSAgents = () => {
  return useQuery({
    queryKey: QUERY_KEYS.AGENTS.LIST,
    queryFn: propertiesApi.getCSAgents,
    staleTime: AGENTS_STALE_TIME, // 10 minutes (agents don't change often)
  });
};

// Transaction Queries
export const useTransactions = (
  page: number = 1,
  limit: number = 10,
  filters?: any
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS.LIST(filters),
    queryFn: () => transactionsApi.getTransactions(page, limit, filters),
    staleTime: STALE_TIME, // 30 seconds
    // @ts-expect-error: keepPreviousData is not in the type but is supported by react-query for pagination
    keepPreviousData: true,
  });
};

export const useTransaction = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS.DETAIL(id),
    queryFn: () => transactionsApi.getTransaction(id),
    enabled: enabled && !!id,
    staleTime: TRANSACTION_DETAIL_STALE_TIME, // 1 minute
  });
};

export const useTransactionSummary = (period?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TRANSACTIONS.SUMMARY, period],
    queryFn: () => transactionsApi.getTransactionSummary(period),
    staleTime: TRANSACTION_SUMMARY_STALE_TIME, // 2 minutes
  });
};

// User Mutations
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<any> }) =>
      usersApi.updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST() });
      queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(variables.id), data);
      showSuccess("Success", "User updated successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: usersApi.activateUser,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST() });
      queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(id), data);
      showSuccess("Success", "User activated successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: usersApi.deactivateUser,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST() });
      queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(id), data);
      showSuccess("Success", "User deactivated successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: usersApi.suspendUser,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST() });
      queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(id), data);
      showSuccess("Success", "User suspended successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

// Property Mutations
export const useApproveProperty = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
      propertiesApi.approveProperty(id, notes),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES.LIST() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROPERTIES.PENDING_VERIFICATION,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.STATS });
      queryClient.setQueryData(
        QUERY_KEYS.PROPERTIES.DETAIL(variables.id),
        data
      );
      showSuccess("Success", "Property approved successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

export const useRejectProperty = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      propertiesApi.rejectProperty(id, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES.LIST() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROPERTIES.PENDING_VERIFICATION,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.STATS });
      queryClient.setQueryData(
        QUERY_KEYS.PROPERTIES.DETAIL(variables.id),
        data
      );
      showSuccess("Success", "Property rejected successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

export const useAssignToCS = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({
      propertyId,
      csAgentId,
    }: {
      propertyId: number;
      csAgentId: number;
    }) => propertiesApi.assignToCS(propertyId, csAgentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES.LIST() });
      queryClient.setQueryData(
        QUERY_KEYS.PROPERTIES.DETAIL(variables.propertyId),
        data
      );
      showSuccess("Success", "Property assigned to CS agent successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

// Transaction Mutations
export const useRefundTransaction = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({
      id,
      reason,
      amount,
    }: {
      id: number;
      reason: string;
      amount?: number;
    }) => transactionsApi.refundTransaction(id, reason, amount),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRANSACTIONS.LIST(),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRANSACTIONS.SUMMARY,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.STATS });
      queryClient.setQueryData(
        QUERY_KEYS.TRANSACTIONS.DETAIL(variables.id),
        data
      );
      showSuccess("Success", "Transaction refunded successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

export const useExportTransactions = () => {
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({
      format,
      filters,
    }: {
      format: "csv" | "xlsx" | "pdf";
      filters?: any;
    }) => transactionsApi.exportTransactions(format, filters),
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions_export.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSuccess("Success", "Transactions exported successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

// Bulk Action Mutations
export const useBulkActivateUsers = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: usersApi.bulkActivateUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.STATS });
      showSuccess("Success", "Users activated successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

export const useBulkDeactivateUsers = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: usersApi.bulkDeactivateUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.STATS });
      showSuccess("Success", "Users deactivated successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

export const useBulkSuspendUsers = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: usersApi.bulkSuspendUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.STATS });
      showSuccess("Success", "Users suspended successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

export const useBulkApproveProperties = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({
      propertyIds,
      notes,
    }: {
      propertyIds: number[];
      notes?: string;
    }) => propertiesApi.bulkApproveProperties(propertyIds, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES.LIST() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROPERTIES.PENDING_VERIFICATION,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.STATS });
      showSuccess("Success", "Properties approved successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

export const useBulkRejectProperties = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({
      propertyIds,
      reason,
    }: {
      propertyIds: number[];
      reason: string;
    }) => propertiesApi.bulkRejectProperties(propertyIds, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROPERTIES.LIST() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROPERTIES.PENDING_VERIFICATION,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.STATS });
      showSuccess("Success", "Properties rejected successfully");
    },
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};
