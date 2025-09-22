import { Agent } from '@app-types/admin/admin';

export interface FilteredAgents {
  availableAgents: Agent[];
  busyAgents: Agent[];
}

export interface AgentTableData {
  id: number;
  name: string;
  email: string;
  active_assignments: number;
  completed_assignments: number;
  workload: string;
  join_date: string;
  status: 'active' | 'busy' | 'offline';
}

/**
 * Filter agents based on their active assignments
 * Available agents: active_assignments === 0
 * Busy agents: active_assignments > 0
 */
export const filterAgentsByAvailability = (agents: Agent[]): FilteredAgents => {
  const availableAgents = agents.filter(agent => 
    agent.status === 'active' && agent.active_assignments === 0
  );

  const busyAgents = agents.filter(agent => 
    agent.status === 'active' && agent.active_assignments > 0
  );

  return { availableAgents, busyAgents };
};

/**
 * Transform agent data for table display
 */
export const transformAgentsForTable = (agents: Agent[]): AgentTableData[] => {
  return agents.map(agent => ({
    id: agent.id,
    name: `${agent.first_name} ${agent.last_name}`,
    email: agent.email,
    active_assignments: agent.active_assignments,
    completed_assignments: agent.completed_assignments,
    workload: calculateWorkloadPercentage(agent.active_assignments, agent.workload_status),
    join_date: formatJoinDate(agent.created_at),
    status: determineAgentStatus(agent.status, agent.active_assignments)
  }));
};

/**
 * Calculate workload percentage based on assignments and status
 */
const calculateWorkloadPercentage = (activeAssignments: number, workloadStatus: string): string => {
  const maxCapacity = getMaxCapacityByStatus(workloadStatus);
  const percentage = Math.round((activeAssignments / maxCapacity) * 100);
  return `${percentage}%`;
};

/**
 * Get maximum capacity based on workload status
 */
const getMaxCapacityByStatus = (workloadStatus: string): number => {
  switch (workloadStatus) {
    case 'low': return 10;
    case 'medium': return 15;
    case 'high': return 20;
    default: return 12;
  }
};

/**
 * Format join date for display
 */
const formatJoinDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Determine agent status based on active assignments
 */
const determineAgentStatus = (apiStatus: string, activeAssignments: number): 'active' | 'busy' | 'offline' => {
  if (apiStatus !== 'active') return 'offline';
  return activeAssignments === 0 ? 'active' : 'busy';
};

/**
 * Check if an agent is available for new assignments
 */
export const isAgentAvailable = (agent: Agent): boolean => {
  return agent.status === 'active' && agent.active_assignments === 0;
};
