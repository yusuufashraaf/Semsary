// src/utils/agentHelpers.ts
import { Agent, ProcessedAgent } from '@app-types/admin/admin';

export const processAgents = (agents: Agent[]): { 
  availableAgents: ProcessedAgent[]; 
  busyAgents: ProcessedAgent[] 
} => {
  // Convert API response to our format
  const processedAgents: ProcessedAgent[] = agents.map(agent => ({
    ...agent,
    current_property_count: agent.active_assignments || 0,
    max_property_capacity: determineCapacity(agent.active_assignments, agent.workload_status),
    status: determineStatus(agent.status, agent.workload_status),
  }));

  // Filter available agents (active with no current assignments)
  const availableAgents = processedAgents.filter(agent => 
    agent.status === 'active' && agent.active_assignments === 0
  );

  // Filter busy agents (active with assignments)
  const busyAgents = processedAgents.filter(agent => 
    agent.status === 'active' && agent.active_assignments > 0
  );

  return { availableAgents, busyAgents };
};

const determineCapacity = (activeAssignments: number, workloadStatus: string): number => {
  // Base capacity on workload status
  switch (workloadStatus) {
    case 'low':
      return Math.max(10, activeAssignments + 5); // At least 10, or current + 5
    case 'medium':
      return Math.max(15, activeAssignments + 3); // At least 15, or current + 3
    case 'high':
      return Math.max(20, activeAssignments + 1); // At least 20, or current + 1
    default:
      return Math.max(12, activeAssignments + 4);
  }
};

const determineStatus = (apiStatus: string, workloadStatus: string): 'active' | 'busy' | 'offline' => {
  if (apiStatus !== 'active') {
    return 'offline';
  }
  
  if (workloadStatus === 'high') {
    return 'busy';
  }
  
  return 'active';
};

export const formatAgentWorkload = (current: number, max: number): {
  percentage: number;
  color: string;
  status: string;
} => {
  const percentage = Math.round((current / max) * 100);
  
  let color = 'text-green-600';
  let status = 'Available';
  
  if (percentage >= 90) {
    color = 'text-red-600';
    status = 'At Capacity';
  } else if (percentage >= 70) {
    color = 'text-yellow-600';
    status = 'Busy';
  }
  
  return { percentage, color, status };
};