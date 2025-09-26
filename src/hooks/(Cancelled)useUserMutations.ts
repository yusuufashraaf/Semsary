/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useUserMutations.ts - Corrected to only use available backend APIs
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@api/endpoints/users";
import { QUERY_KEYS } from "@app-types/admin/admin";
import { useNotifications } from "@store/admin/adminStore";
import { handleQueryError } from "@lib/queryClient";
import { TFullUser } from "@app-types/users/users.types";
//import type { User } from "@app-types/admin/admin";

// User Action Mutations - Only using available backend routes

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason?: string }) =>
      usersApi.activateUser(userId, reason),
    onMutate: async ({ userId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.USERS.DETAIL(userId) });
      
      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(QUERY_KEYS.USERS.DETAIL(userId));
      
      // Optimistically update to the new value
      queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(userId), (old: TFullUser | undefined) => 
        old ? { ...old, status: 'active' as const } : old
      );
      
      return { previousUser };
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST() });
      queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(userId), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.STATS });
      
      showSuccess("Success", "User activated successfully");
    },
    onError: (error, { userId }, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(userId), context.previousUser);
      }
      
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
      usersApi.suspendUser(userId, reason),
    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.USERS.DETAIL(userId) });
      
      const previousUser = queryClient.getQueryData(QUERY_KEYS.USERS.DETAIL(userId));
      
      queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(userId), (old: TFullUser | undefined) => 
        old ? { ...old, status: 'suspended' as const } : old
      );
      
      return { previousUser };
    },
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST() });
      queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(userId), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.STATS });
      
      showSuccess("Success", "User suspended successfully");
    },
    onError: (error, { userId }, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(userId), context.previousUser);
      }
      
      const apiError = handleQueryError(error);
      showError("Error", apiError.message);
    },
  });
};

// Search Users
export const useSearchUsers = () => {
  const { showError } = useNotifications();

  return useMutation({
    mutationFn: ({ term, limit = 10 }: { term: string; limit?: number }) =>
      usersApi.searchUsers(term, limit),
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Search Error", apiError.message);
    },
  });
};

// User Statistics Query
export const useUserStatistics = () => {
  const { showError } = useNotifications();

  return useMutation({
    mutationFn: () => usersApi.getUserStatistics(),
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", `Failed to load user statistics: ${apiError.message}`);
    },
  });
};

// Users Requiring Attention Query
export const useUsersRequiringAttention = () => {
  const { showError } = useNotifications();

  return useMutation({
    mutationFn: () => usersApi.getUsersRequiringAttention(),
    onError: (error) => {
      const apiError = handleQueryError(error);
      showError("Error", `Failed to load users requiring attention: ${apiError.message}`);
    },
  });
};

// REMOVED: useExportUsers - backend route not available
// REMOVED: useBulkActivateUsers - backend route not available  
// REMOVED: useBulkSuspendUsers - backend route not available