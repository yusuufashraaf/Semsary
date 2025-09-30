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
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAdminCsAgents } from "@hooks/admin/useAdminCsAgentQueries";

export type TFullUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  google_id: string | null;
  email_verified_at: string | null;
  email_otp: string | null;
  email_otp_expires_at: string | null;
  id_image_url: string | null;
  role: "user" | "admin" | "owner" | "agent";
  id_state: "pending"|"valid"|"rejected";
  phone_number: string;
  status: "pending" | "active" | "suspended";
  phone_verified_at: string | null;
  whatsapp_otp: string | null;
  whatsapp_otp_expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export const CsAgentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch CS agents with pagination
  const { data: agentsResponse, isLoading, error } = useAdminCsAgents(1, 50);

  // Extract agents array from paginated response
  const agents = agentsResponse?.data || [];

  // Filter agents based on search
  const filteredAgents = agents.filter((agent: TFullUser) =>
    agent.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone_number?.includes(searchTerm)
  );

  const getStatusColor = (status: TFullUser['status']) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getIdStateColor = (state: TFullUser['id_state']) => {
    switch (state) {
      case 'valid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleViewAgent = (agentId: number) => {
    navigate(`/admin/cs-agents/${agentId}`);
  };

  const handleContactAgent = (agent: TFullUser) => {
    console.log('Contact agent:', agent);
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                  Active Agents
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {agents.filter((a: TFullUser) => a.status === "active").length}
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
                  Pending Verification
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {agents.filter((a: TFullUser) => a.id_state === "pending").length}
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
                  Suspended
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {agents.filter((a: TFullUser) => a.status === "suspended").length}
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
              placeholder="Search agents by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Agents List */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {filteredAgents.map((agent: TFullUser) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    {agent.id_image_url ? (
                      <img 
                        src={agent.id_image_url} 
                        alt={`${agent.first_name} ${agent.last_name}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {agent.first_name} {agent.last_name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {agent.email}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {agent.phone_number}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                  <Badge variant={getIdStateColor(agent.id_state)}>
                    ID: {agent.id_state}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Role</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                      Agent
                    </p>
                  </div>
                  {/* <div>
                    <p className="text-gray-500 dark:text-gray-400">Phone Verified</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {agent.phone_verified_at ? 'Yes' : 'No'}
                    </p>
                  </div> */}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {/* <div>
                    <p className="text-gray-500 dark:text-gray-400">Email Verified</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {agent.email_verified_at ? 'Yes' : 'No'}
                    </p>
                  </div> */}
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Google ID</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {agent.google_id ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(agent.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div> */}

                {/* {(agent.email_otp || agent.whatsapp_otp) && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {agent.email_otp && (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Email OTP</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {agent.email_otp}
                        </p>
                      </div>
                    )}
                    {agent.whatsapp_otp && (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">WhatsApp OTP</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {agent.whatsapp_otp}
                        </p>
                      </div>
                    )}
                  </div>
                )} */}
              </div>

              {/* <div className="mt-6 flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewAgent(agent.id)}
                  className="flex-1"
                >
                  View Profile
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/admin/agents/${agent.id}/assignments`)}
                  className="flex-1"
                >
                  Assignments
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleContactAgent(agent)}
                  className="flex-1"
                >
                  Contact
                </Button>
              </div> */}
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

      {filteredAgents.length === 0 && !searchTerm && (
        <Card>
          <div className="p-8 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No agents available
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              There are no CS agents in the system yet.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CsAgentsPage;