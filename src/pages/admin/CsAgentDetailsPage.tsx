// src/pages/admin/CsAgentDetailsPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Alert } from '@components/ui/Alert';
import { Select } from '@components/ui/Select';
import { Modal } from '@components/ui/Modal';
import { 
  ArrowLeftIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { adminCsAgentApi } from '@api/endpoints/admin/csAgents';
// Remove unused import

export const CsAgentDetailsPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [selectedAssignments, setSelectedAssignments] = useState<number[]>([]);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [newAgentId, setNewAgentId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const numericAgentId = agentId ? parseInt(agentId) : 0;

  // Fetch CS agent details
  const { 
    data: agent, 
    isLoading: agentLoading, 
    error: agentError 
  } = useQuery({
    queryKey: ['admin', 'cs-agent', numericAgentId],
    queryFn: () => adminCsAgentApi.getAgent(numericAgentId),
    enabled: !!numericAgentId,
  });

  // Fetch agent's assignments
  const { 
    data: assignmentsData, 
    isLoading: assignmentsLoading, 
    error: assignmentsError,
    refetch: refetchAssignments
  } = useQuery({
    queryKey: ['admin', 'cs-agent-assignments', numericAgentId, statusFilter],
    queryFn: () => adminCsAgentApi.getAllAssignments({
      agent_id: numericAgentId,
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    enabled: !!numericAgentId,
  });

  // Fetch available agents for reassignment
  const { data: availableAgents = [] } = useQuery({
    queryKey: ['admin', 'available-agents'],
    queryFn: adminCsAgentApi.getAvailableAgents,
    enabled: showReassignModal,
  });

  // Reassign assignments mutation
  const reassignMutation = useMutation({
    mutationFn: async ({ assignmentIds, newAgentId }: { 
      assignmentIds: number[], 
      newAgentId: number 
    }) => {
      // Call reassign API for each assignment
      const promises = assignmentIds.map(id => 
        adminCsAgentApi.reassignProperty(id, newAgentId)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'cs-agent-assignments', numericAgentId]
      });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'cs-agent', numericAgentId]
      });
      setShowReassignModal(false);
      setSelectedAssignments([]);
      setNewAgentId(null);
    },
  });

  const assignments = assignmentsData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'in_progress': return 'primary';
      case 'completed': return 'success';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const handleSelectAssignment = (assignmentId: number) => {
    setSelectedAssignments(prev => 
      prev.includes(assignmentId)
        ? prev.filter(id => id !== assignmentId)
        : [...prev, assignmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssignments.length === assignments.length) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(assignments.map(a => a.id));
    }
  };

  const handleReassign = () => {
    if (selectedAssignments.length > 0 && newAgentId) {
      reassignMutation.mutate({
        assignmentIds: selectedAssignments,
        newAgentId,
      });
    }
  };

  const handleViewProperty = (propertyId: number) => {
    navigate(`/admin/properties/${propertyId}`);
  };

  if (agentLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (agentError || !agent) {
    return (
      <Alert type="error" title="Failed to load agent">
        {(agentError as any)?.message || 'CS Agent not found.'}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/cs-agents')}
            className="p-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {agent.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              CS Agent Details & Assignments
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={agent.status === 'active' ? 'success' : 'secondary'}>
            {agent.status || 'inactive'}
          </Badge>
        </div>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Current Assignments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(agent as any).current_assignments || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(agent as any).completed_assignments || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(agent as any).success_rate || 0}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Avg. Time
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(agent as any).average_completion_time || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Assignments Filter & Actions */}
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-48"
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'rejected', label: 'Rejected' },
                ]}
              />
              {selectedAssignments.length > 0 && (
                <Badge variant="primary">
                  {selectedAssignments.length} selected
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {selectedAssignments.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => setShowReassignModal(true)}
                  className="flex items-center space-x-1"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Reassign</span>
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => refetchAssignments()}
                className="p-2"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Assignments List */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Property Assignments
            </h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedAssignments.length === assignments.length && assignments.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Select All</span>
            </label>
          </div>

          {assignmentsLoading ? (
            <div className="flex h-32 items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : assignmentsError ? (
            <Alert type="error" title="Failed to load assignments">
              {(assignmentsError as any)?.message || 'An error occurred.'}
            </Alert>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No assignments found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This agent doesn't have any assignments matching the current filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedAssignments.includes(assignment.id)}
                    onChange={() => handleSelectAssignment(assignment.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {assignment.property?.title || `Property #${assignment.property_id}`}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Assignment #{assignment.id}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                        <Badge variant={getPriorityColor(assignment.priority || 'medium')}>
                          {assignment.priority || 'medium'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Assigned</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {assignment.assigned_at ? 
                            new Date(assignment.assigned_at).toLocaleDateString() : 
                            'N/A'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Started</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {assignment.started_at ? 
                            new Date(assignment.started_at).toLocaleDateString() : 
                            'Not started'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Duration</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {assignment.duration_hours ? 
                            `${assignment.duration_hours}h` : 
                            'N/A'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Property Type</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {assignment.property?.type || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {assignment.notes && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Notes:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {assignment.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProperty(assignment.property_id)}
                      className="flex items-center space-x-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Reassign Modal */}
      <Modal
        isOpen={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        title="Reassign Assignments"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Reassign {selectedAssignments.length} assignment(s) to another CS agent.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select New Agent
            </label>
            <Select
              value={newAgentId?.toString() || ''}
              onChange={(e) => setNewAgentId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full"
              options={[
                { value: '', label: 'Select an agent...' },
                ...availableAgents
                  .filter(a => a.id !== numericAgentId)
                  .map(agent => ({
                    value: agent.id.toString(),
                    label: `${agent.name} (${(agent as any).current_assignments || 0} assignments)`
                  }))
              ]}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowReassignModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleReassign}
              disabled={!newAgentId || reassignMutation.isPending}
            >
              {reassignMutation.isPending ? 'Reassigning...' : 'Reassign'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CsAgentDetailsPage;
