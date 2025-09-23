import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { csAgentApi } from "@api/endpoints/csAgent";
import {
  useCsAgentUIStore,
  useCsAgentNotifications,
} from "@store/cs-agent/csAgentStore";
import { CS_AGENT_QUERY_KEYS } from "./useCsAgentDashboard";
import type {
  AssignmentFilters,
  PropertyAssignment,
  UpdateAssignmentData,
  VerificationStatus,
} from "@app-types/cs-agent/cs-agent";

export const useCsAgentProperties = (filters?: AssignmentFilters) => {
  const { setLoading } = useCsAgentUIStore();

  return useQuery({
    queryKey: CS_AGENT_QUERY_KEYS.PROPERTIES(filters),
    queryFn: async () => {
      setLoading("properties", true);
      try {
        const response = await csAgentApi.getProperties(filters);
        // Return the full paginated response so consumers can access data and pagination
        return response;
      } finally {
        setLoading("properties", false);
      }
    },
    staleTime: 30000,
    retry: 2,
  });
};

export const usePropertyDetails = (
  propertyId: number,
  enablePolling = false
) => {
  return useQuery({
    queryKey: CS_AGENT_QUERY_KEYS.PROPERTY(propertyId),
    queryFn: async () => {
      const response = await csAgentApi.getPropertyDetails(propertyId);
      return response.data;
    },
    enabled: !!propertyId,
    staleTime: enablePolling ? 30000 : 60000,
    refetchInterval: enablePolling ? 30000 : false, // Poll every 30 seconds if enabled
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: 3,
  });
};

export const useUpdateVerificationStatus = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useCsAgentNotifications();

  return useMutation({
    mutationFn: async ({
      propertyId,
      data,
    }: {
      propertyId: number;
      data: UpdateAssignmentData;
    }) => {
      try {
        const response = await csAgentApi.updateVerificationStatus(
          propertyId,
          data
        );
        return response.data;
      } catch (error: any) {
        // Enhanced error handling
        if (error.response?.status === 422) {
          throw new Error(error.response.data.message || "Validation failed");
        } else if (error.response?.status === 403) {
          throw new Error(
            "You do not have permission to update this assignment"
          );
        } else if (error.response?.status === 404) {
          throw new Error("Assignment not found");
        } else if (error.response?.status >= 500) {
          throw new Error("Server error. Please try again later.");
        }
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries with error handling
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: CS_AGENT_QUERY_KEYS.PROPERTIES(),
        }),
        queryClient.invalidateQueries({
          queryKey: CS_AGENT_QUERY_KEYS.PROPERTY(variables.propertyId),
        }),
        queryClient.invalidateQueries({
          queryKey: CS_AGENT_QUERY_KEYS.DASHBOARD,
        }),
      ]).catch((err) => {
        console.warn("Failed to invalidate some queries:", err);
      });

      showSuccess(
        "Status Updated",
        `Property verification status has been updated to ${variables.data.status}`
      );
    },
    onError: (error: any) => {
      console.error("Status update error:", error);
      showError(
        "Update Failed",
        error.message ||
          error.response?.data?.message ||
          "Failed to update verification status"
      );
    },
    retry: (failureCount, error: any) => {
      // Don't retry validation errors or permission errors
      if (error.response?.status === 422 || error.response?.status === 403) {
        return false;
      }
      // Retry up to 2 times for network/server errors
      return failureCount < 2;
    },
  });
};

export const useStartVerification = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useCsAgentNotifications();

  return useMutation({
    mutationFn: async (propertyId: number) => {
      const data: UpdateAssignmentData = {
        status: "in_progress" as VerificationStatus,
        notes: "Verification started",
      };
      const response = await csAgentApi.updateVerificationStatus(
        propertyId,
        data
      );
      return response.data;
    },
    onSuccess: (data, propertyId) => {
      queryClient.invalidateQueries({
        queryKey: CS_AGENT_QUERY_KEYS.PROPERTIES(),
      });
      queryClient.invalidateQueries({
        queryKey: CS_AGENT_QUERY_KEYS.PROPERTY(propertyId),
      });

      showSuccess(
        "Verification Started",
        "You have started the verification process for this property"
      );
    },
    onError: (error: any) => {
      showError(
        "Failed to Start",
        error.response?.data?.message || "Could not start verification process"
      );
    },
  });
};

export const useCompleteVerification = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useCsAgentNotifications();

  return useMutation({
    mutationFn: async ({
      propertyId,
      notes,
    }: {
      propertyId: number;
      notes: string;
    }) => {
      const data: UpdateAssignmentData = {
        status: "completed" as VerificationStatus,
        notes,
      };
      const response = await csAgentApi.updateVerificationStatus(
        propertyId,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CS_AGENT_QUERY_KEYS.PROPERTIES(),
      });
      queryClient.invalidateQueries({
        queryKey: CS_AGENT_QUERY_KEYS.PROPERTY(variables.propertyId),
      });
      queryClient.invalidateQueries({
        queryKey: CS_AGENT_QUERY_KEYS.DASHBOARD,
      });

      showSuccess(
        "Verification Completed",
        "Property verification has been successfully completed"
      );
    },
    onError: (error: any) => {
      showError(
        "Completion Failed",
        error.response?.data?.message || "Failed to complete verification"
      );
    },
  });
};

export const useRejectVerification = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useCsAgentNotifications();

  return useMutation({
    mutationFn: async ({
      propertyId,
      reason,
    }: {
      propertyId: number;
      reason: string;
    }) => {
      const data: UpdateAssignmentData = {
        status: "rejected" as VerificationStatus,
        notes: reason,
      };
      const response = await csAgentApi.updateVerificationStatus(
        propertyId,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CS_AGENT_QUERY_KEYS.PROPERTIES(),
      });
      queryClient.invalidateQueries({
        queryKey: CS_AGENT_QUERY_KEYS.PROPERTY(variables.propertyId),
      });

      showSuccess(
        "Verification Rejected",
        "Property verification has been rejected with the provided reason"
      );
    },
    onError: (error: any) => {
      showError(
        "Rejection Failed",
        error.response?.data?.message || "Failed to reject verification"
      );
    },
  });
};
