// src/pages/admin/AssignmentsPage.tsx
import React, { useState } from 'react';
import { useAdminAssignments } from '@hooks/admin/useAdminCsAgentQueries';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Alert } from '@components/ui/Alert';
import { Select } from '@components/ui/Select';
import { Input } from '@components/ui/Input';
import { 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  UserIcon,
  HomeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export const AssignmentsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Build filters object
  const filters: any = {
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(priorityFilter !== 'all' && { priority: priorityFilter }),
    ...(searchTerm && { search: searchTerm }),
  };

  // Fetch assignments
  const { 
    data: assignmentsResponse, 
    isLoading, 
    error 
  } = useAdminAssignments(filters);

  const assignments = assignmentsResponse?.data || [];

  console.log('AssignmentsPage Debug:', {
    assignmentsResponse,
    assignments,
    totalAssignments: assignments.length,
    isLoading,
    error
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'rejected': return 'error';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" title="Failed to load assignments">
        {(error as any)?.message || 'An error occurred while loading assignments.'}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Property Assignments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and monitor all property verification assignments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Assignments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assignmentsResponse?.pagination?.total || assignments.length}
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
                  Pending
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assignments.filter((a: any) => a.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assignments.filter((a: any) => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <HomeIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Rejected
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assignments.filter((a: any) => a.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />

            {/* Priority Filter */}
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: 'high', label: 'High Priority' },
                { value: 'medium', label: 'Medium Priority' },
                { value: 'low', label: 'Low Priority' },
              ]}
            />

            <Button onClick={() => {
              setStatusFilter('all');
              setPriorityFilter('all');
              setSearchTerm('');
            }}>
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Assignments Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                  Assignment
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                  Property
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                  CS Agent
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                  Priority
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                  Assigned
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {assignments.map((assignment: any) => (
                <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        #{assignment.id}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs truncate max-w-xs">
                        {assignment.notes || 'No notes'}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    {assignment.property ? (
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                          {assignment.property.title}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          {assignment.property.type} • {assignment.property.formatted_price}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No property</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-4">
                    {assignment.cs_agent ? (
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {assignment.cs_agent.name}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          {assignment.cs_agent.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-4">
                    <Badge color={getStatusColor(assignment.status)}>
                      {assignment.formatted_status}
                    </Badge>
                  </td>
                  
                  <td className="px-4 py-4">
                    <Badge color={getPriorityColor(assignment.priority)}>
                      {assignment.priority.toUpperCase()}
                    </Badge>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-gray-900 dark:text-white">
                      {assignment.time_since_assigned}
                    </div>
                    {assignment.completed_at && (
                      <div className="text-gray-500 dark:text-gray-400 text-xs">
                        Completed: {new Date(assignment.completed_at).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Navigate to assignment details or property details
                          console.log('View assignment:', assignment.id);
                        }}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {assignments.length === 0 && (
            <div className="text-center py-8">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No assignments found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No assignments match your current filters.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AssignmentsPage;
