// src/components/admin/modals/AgentAssignmentModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Badge } from '@components/ui/Badge';
import { UserIcon } from '@heroicons/react/24/outline';
import { Agent } from '@app-types/admin/admin';
import Swal from 'sweetalert2';
import { filterAgentsByAvailability, transformAgentsForTable, AgentTableData } from '@utils/agentFilters';

interface AgentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (agentId: number, propertyId: number, assignmentData: any) => Promise<boolean>;
  propertyId: number;
  propertyTitle: string;
  agents: Agent[];
  loading?: boolean;
  hasActiveAssignment?: boolean;
}

export const AgentAssignmentModal: React.FC<AgentAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  propertyId,
  propertyTitle,
  agents,
  loading = false,
  hasActiveAssignment = false,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assignmentType, setAssignmentType] = useState<'verification' | 'inspection' | 'follow_up'>('verification');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Filter agents using the new filtering logic
  const { availableAgents, busyAgents } = filterAgentsByAvailability(agents);
  const availableAgentsTableData = transformAgentsForTable(availableAgents);
  const busyAgentsTableData = transformAgentsForTable(busyAgents);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAgentId(null);
      setPriority('medium');
      setAssignmentType('verification');
      setNotes('');
      setDueDate('');
    }
  }, [isOpen]);

  // Set default due date to 7 days from now
  useEffect(() => {
    if (isOpen && !dueDate) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setDueDate(defaultDate.toISOString().split('T')[0]);
    }
  }, [isOpen, dueDate]);

  const handleAssign = async () => {
    if (!selectedAgentId) {
      Swal.fire({
        title: 'No Agent Selected',
        text: 'Please select an agent before proceeding.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (!dueDate) {
      Swal.fire({
        title: 'Due Date Required',
        text: 'Please select a due date for this assignment.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setIsAssigning(true);

    try {
      const assignmentData = {
        priority,
        due_date: dueDate,
        assignment_type: assignmentType,
        notes: notes || `Please ${assignmentType} the property and provide feedback.`
      };

      const success = await onAssign(selectedAgentId, propertyId, assignmentData);
      
      if (success) {
        const selectedAgent = [...availableAgents, ...busyAgents].find(a => a.id === selectedAgentId);
        await Swal.fire({
          title: 'Assignment Successful!',
          text: `Property "${propertyTitle}" has been assigned to ${selectedAgent?.first_name} ${selectedAgent?.last_name}.`,
          icon: 'success',
          confirmButtonText: 'Great!',
          confirmButtonColor: '#10B981',
          timer: 3000,
          timerProgressBar: true,
        });
        onClose();
      } else {
        await Swal.fire({
          title: 'Assignment Failed',
          text: 'There was an error assigning the property. The property may already have an active assignment.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444',
        });
      }
    } catch (error) {
      await Swal.fire({
        title: 'Assignment Failed',
        text: 'An unexpected error occurred. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const renderAgentTable = (agents: AgentTableData[], title: string, isAvailable: boolean = true) => (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-900 mb-4">
        {title} ({agents.length} {isAvailable ? 'available' : 'busy'})
      </h4>

      {agents.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">
            No {isAvailable ? 'available' : 'busy'} agents
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {isAvailable 
              ? 'All agents currently have active assignments' 
              : 'No agents are currently busy with assignments'
            }
          </p>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Assignments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Assignments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workload
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agents.map((agent) => (
                <tr 
                  key={agent.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedAgentId === agent.id ? 'bg-blue-50 border-blue-200' : ''
                  } ${!isAvailable ? 'opacity-75' : ''}`}
                  onClick={() => setSelectedAgentId(agent.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="radio"
                      name="selectedAgent"
                      checked={selectedAgentId === agent.id}
                      onChange={() => setSelectedAgentId(agent.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {agent.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {agent.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={agent.active_assignments === 0 ? 'success' : 'warning'} 
                      size="sm"
                    >
                      {agent.active_assignments}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.completed_assignments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {agent.workload}
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            parseInt(agent.workload) >= 90
                              ? 'bg-red-500'
                              : parseInt(agent.workload) >= 70
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(parseInt(agent.workload), 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agent.join_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  if (hasActiveAssignment) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Property Assignment"
        size="md"
      >
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <UserIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Property Already Assigned
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            This property already has an active assignment and cannot be assigned to another agent.
          </p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Customer Service Agent"
      size="xl"
    >
      <div className="space-y-6">
        {/* Property Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Property to Assign:</h4>
          <p className="text-gray-700 font-medium">{propertyTitle}</p>
          <p className="text-sm text-gray-500">ID: {propertyId}</p>
        </div>

        {/* Assignment Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Type
            </label>
            <select
              value={assignmentType}
              onChange={(e) => setAssignmentType(e.target.value as 'verification' | 'inspection' | 'follow_up')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="verification">Verification</option>
              <option value="inspection">Inspection</option>
              <option value="follow_up">Follow Up</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignment Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Please verify all property documents and contact owner for missing information..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
            <span className="ml-2 text-gray-500">Loading agents...</span>
          </div>
        ) : (
          <>
            {/* Available Agents Table */}
            {renderAgentTable(availableAgentsTableData, 'Available Agents', true)}

            {/* Busy Agents Table */}
            {renderAgentTable(busyAgentsTableData, 'Busy Agents', false)}

            {/* Total Agents Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">
                  Total: {agents.length} agents
                </span>{' '}
                ({availableAgents.length} available, {busyAgents.length} busy)
              </p>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssign}
            disabled={!selectedAgentId || isAssigning || agents.length === 0}
            loading={isAssigning}
          >
            {isAssigning ? 'Assigning...' : 'Assign Agent'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};