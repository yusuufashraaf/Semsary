import { useQuery } from '@tanstack/react-query';
import { csAgentApi } from '@api/endpoints/csAgent';
import { useCsAgentUIStore } from '@store/cs-agent/csAgentStore';
import type { CsAgentDashboard } from '@app-types/cs-agent/cs-agent';

export const CS_AGENT_QUERY_KEYS = {
  DASHBOARD: ['cs-agent', 'dashboard'] as const,
  PROPERTIES: (filters?: any) => ['cs-agent', 'properties', filters] as const,
  PROPERTY: (id: number) => ['cs-agent', 'property', id] as const,
  VERIFICATIONS: ['cs-agent', 'verifications'] as const,
  PERFORMANCE: ['cs-agent', 'performance'] as const,
};

export const useCsAgentDashboard = () => {
  const { setLoading } = useCsAgentUIStore();

  return useQuery({
    queryKey: CS_AGENT_QUERY_KEYS.DASHBOARD,
    queryFn: async () => {
      setLoading('dashboard', true);
      try {
        const response = await csAgentApi.getDashboard();
        return response.data;
      } finally {
        setLoading('dashboard', false);
      }
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    retry: 3,
  });
};
