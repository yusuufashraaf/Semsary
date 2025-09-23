// src/pages/admin/CsAgentsPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { Badge } from "@components/ui/Badge";
import { LoadingSpinner } from "@components/ui/LoadingSpinner";
import { Alert } from "@components/ui/Alert";
import { Input } from "@components/ui/Input";
import {
  UserIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAdminCsAgents } from "@hooks/admin/useAdminCsAgentQueries";

export const CsAgentsPage: React.FC = () => {
  // Optional: Debug logging (remove in production)
  // console.log('CsAgentsPage Debug:', {
  //   agentsResponse,
  //   agents,
  //   totalAgents: agents.length,
  //   totalFromAPI: agentsResponse?.pagination?.total,
  //   currentPage: agentsResponse?.pagination?.current_page,
  //   isLoading,
  //   error
  // });

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch CS agents with pagination
  const { data: agentsResponse, isLoading, error } = useAdminCsAgents(1, 50); // Get first 50 agents for now

  // Extract agents array from paginated response
  const agents = agentsResponse?.data || [];

  // Filter agents based on search
  const filteredAgents = agents.filter(
    (agent: any) =>
      agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "busy":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 15) return "danger";
    if (workload >= 10) return "warning";
    return "success";
  };

  const handleViewAgent = (agentId: number) => {
    navigate(`/admin/cs-agents/${agentId}`);
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
      <Alert type="error" title="Failed to load CS agents">
        {(error as any)?.message ||
          "An error occurred while loading CS agents."}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            CS Agents Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage customer support agents and their property assignments
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/admin/cs-agents/create")}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add New Agent</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Agents
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {agents.length}
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
                  Busy Agents
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {agents.filter((a: any) => a.status === "busy").length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Assignments
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {agents.reduce(
                    (sum: number, agent: any) =>
                      sum + (agent.active_assignments || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Overloaded
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    agents.filter(
                      (a: any) => (a.current_assignments || 0) >= 15
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <div className="p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search agents by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Agents List */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {filteredAgents.map((agent: any) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {agent.email}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusColor(agent.status || "inactive")}>
                  {agent.status || "inactive"}
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Current Assignments
                    </p>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {(agent as any).current_assignments || 0}
                      </p>
                      <Badge
                        variant={getWorkloadColor(
                          (agent as any).current_assignments || 0
                        )}
                        size="sm"
                      >
                        {((agent as any).current_assignments || 0) >= 15
                          ? "High"
                          : ((agent as any).current_assignments || 0) >= 10
                          ? "Medium"
                          : "Low"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Completed
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {(agent as any).completed_assignments || 0}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Success Rate
                    </p>
                    <p className="font-semibold text-green-600">
                      {(agent as any).success_rate || 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Avg. Time
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {(agent as any).average_completion_time || "N/A"}
                    </p>
                  </div>
                </div>

                {(agent as any).last_active_at && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last active:{" "}
                      {new Date(
                        (agent as any).last_active_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewAgent(agent.id)}
                  className="flex-1"
                >
                  View Details
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/admin/cs-agents/${agent.id}`)}
                  className="flex-1"
                >
                  Assignments
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && searchTerm && (
        <Card>
          <div className="p-8 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No agents found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No CS agents match your search criteria.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CsAgentsPage;
