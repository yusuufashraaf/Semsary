import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, propertiesApi } from '@api/endpoints/admin';
import { adminCsAgentApi } from '@api/endpoints/admin/csAgents';
import {
  confirmUserBlock,
  confirmUserSuspension,
  confirmAssignmentDeletion,
  confirmBulkOperation,
  showSuccessNotification,
  showErrorNotification
} from '@utils/confirmationDialogs';

export const useBlockUserWithConfirmation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userName }: { id: number; userName?: string }) => {
      const confirmed = await confirmUserBlock(userName);
      if (!confirmed) throw new Error('User cancelled the action');
      
      return usersApi.blockUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showSuccessNotification('User Blocked', 'User has been blocked successfully');
    },
    onError: (error: any) => {
      if (error.message !== 'User cancelled the action') {
        showErrorNotification('Block Failed', error.response?.data?.message || 'Failed to block user');
      }
    }
  });
};

export const useSuspendUserWithConfirmation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userName, duration }: { id: number; userName?: string; duration?: string }) => {
      const confirmed = await confirmUserSuspension(userName, duration);
      if (!confirmed) throw new Error('User cancelled the action');
      
      return usersApi.suspendUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showSuccessNotification('User Suspended', 'User has been suspended successfully');
    },
    onError: (error: any) => {
      if (error.message !== 'User cancelled the action') {
        showErrorNotification('Suspension Failed', error.response?.data?.message || 'Failed to suspend user');
      }
    }
  });
};

export const useDeleteAssignmentWithConfirmation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, details }: { id: number; details?: string }) => {
      const confirmed = await confirmAssignmentDeletion(details);
      if (!confirmed) throw new Error('User cancelled the action');
      
      return adminCsAgentApi.deleteAssignment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'assignments'] });
      showSuccessNotification('Assignment Deleted', 'Assignment has been deleted successfully');
    },
    onError: (error: any) => {
      if (error.message !== 'User cancelled the action') {
        showErrorNotification('Deletion Failed', error.response?.data?.message || 'Failed to delete assignment');
      }
    }
  });
};

export const useBulkApproveWithConfirmation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ propertyIds, notes }: { propertyIds: number[]; notes?: string }) => {
      const confirmed = await confirmBulkOperation('approve', propertyIds.length, 'properties');
      if (!confirmed) throw new Error('User cancelled the action');
      
      return propertiesApi.bulkApproveProperties(propertyIds, notes);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      showSuccessNotification('Properties Approved', `${variables.propertyIds.length} properties have been approved`);
    },
    onError: (error: any) => {
      if (error.message !== 'User cancelled the action') {
        showErrorNotification('Bulk Approve Failed', error.response?.data?.message || 'Failed to approve properties');
      }
    }
  });
};

export const useBulkRejectWithConfirmation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ propertyIds, reason }: { propertyIds: number[]; reason: string }) => {
      const confirmed = await confirmBulkOperation('reject', propertyIds.length, 'properties');
      if (!confirmed) throw new Error('User cancelled the action');
      
      return propertiesApi.bulkRejectProperties(propertyIds, reason);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      showSuccessNotification('Properties Rejected', `${variables.propertyIds.length} properties have been rejected`);
    },
    onError: (error: any) => {
      if (error.message !== 'User cancelled the action') {
        showErrorNotification('Bulk Reject Failed', error.response?.data?.message || 'Failed to reject properties');
      }
    }
  });
};

export const useBulkAssignWithConfirmation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { property_ids: number[]; cs_agent_id: number; priority?: string }) => {
      const confirmed = await confirmBulkOperation('assign', data.property_ids.length, 'properties');
      if (!confirmed) throw new Error('User cancelled the action');
      
      return adminCsAgentApi.bulkAssignProperties(data);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cs-agents', 'assignments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      
      const successCount = result.assigned_properties.length;
      const failCount = result.non_assignable_properties.length;
      
      if (failCount > 0) {
        showErrorNotification(
          'Partial Assignment', 
          `${successCount} properties assigned, ${failCount} failed`
        );
      } else {
        showSuccessNotification(
          'Assignment Complete', 
          `All ${successCount} properties assigned successfully`
        );
      }
    },
    onError: (error: any) => {
      if (error.message !== 'User cancelled the action') {
        showErrorNotification('Assignment Failed', error.response?.data?.message || 'Failed to assign properties');
      }
    }
  });
};
