import React, { useState } from "react";
import { PropertyAssignmentCard } from "./PropertyAssignmentCard";
import {
  useCsAgentProperties,
  useStartVerification,
  useCompleteVerification,
  useRejectVerification,
} from "@hooks/cs-agent/usePropertyVerification";
import { useCsAgentFilterStore, useCsAgentNotifications } from "@store/cs-agent/csAgentStore";
import { Alert } from "@components/ui/Alert";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Select } from "@components/ui/Select";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@utils/classNames";
import type {
  VerificationStatus,
  Priority,
  PropertyType,
  PropertyAssignment,
} from "@app-types/cs-agent/cs-agent";

// Local lightweight skeleton to avoid cross-file resolution issues
const AssignmentCardSkeleton: React.FC = () => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="h-16 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-3">
      <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
    </div>
    <div className="mt-4 flex items-center justify-between">
      <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="flex space-x-2">
        <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  </div>
);

export const PropertyTaskQueue: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VerificationStatus | "all">("all");
  const { propertyFilters, setPropertyFilters } = useCsAgentFilterStore();
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { showError } = useCsAgentNotifications();

  const { data: paginatedData, isLoading, error, refetch } = useCsAgentProperties({
    ...propertyFilters,
    status: activeTab === "all" ? undefined : [activeTab],
    page: currentPage,
  });

  // Handle both array and paginated response structures
  // Using any casting to handle API response structure mismatches
  const assignments = Array.isArray(paginatedData) 
    ? paginatedData as PropertyAssignment[]
    : ((paginatedData as any)?.data || []) as PropertyAssignment[];
  const pagination = Array.isArray(paginatedData) 
    ? undefined 
    : (paginatedData as any)?.pagination;

  const startVerificationMutation = useStartVerification();
  const completeVerificationMutation = useCompleteVerification();
  const rejectVerificationMutation = useRejectVerification();

  // Recalculate counts based on the fetched assignments
  const allAssignmentsCount = assignments.length;
  const pendingCount = assignments.filter(
    (item: PropertyAssignment) => item.status === "pending"
  ).length;
  const inProgressCount = assignments.filter(
    (item: PropertyAssignment) => item.status === "in_progress"
  ).length;
  const completedCount = assignments.filter(
    (item: PropertyAssignment) => item.status === "completed"
  ).length;
  const rejectedCount = assignments.filter(
    (item: PropertyAssignment) => item.status === "rejected"
  ).length;

  const tabs = [
    {
      id: "all",
      label: "All Tasks",
      count: allAssignmentsCount,
    },
    { id: "pending", label: "Pending", count: pendingCount },
    {
      id: "in_progress",
      label: "In Progress",
      count: inProgressCount,
    },
    { id: "completed", label: "Completed", count: completedCount },
    { id: "rejected", label: "Rejected", count: rejectedCount },
  ];

  const handleSearch = (value: string) => {
    setPropertyFilters({ search: value });
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePriorityFilter = (priority: Priority | "") => {
    setPropertyFilters({ priority: priority || undefined });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleQuickAction = async (
    assignmentId: number,
    action: "start" | "complete" | "reject"
  ) => {
    try {
      const target = assignments.find((a: PropertyAssignment) => a.id === assignmentId);
      if (!target) throw new Error("Assignment not found");
      const propertyId = (target as any).property_id || target.property?.id || assignmentId;

      switch (action) {
        case "start": {
          const ok = window.confirm("Start verification for this property?");
          if (!ok) return;
          await startVerificationMutation.mutateAsync(propertyId);
          break;
        }
        case "complete": {
          const note =
            window.prompt("Add an optional completion note:", "Completed via task queue") ||
            "Completed via task queue";
          await completeVerificationMutation.mutateAsync({
            propertyId,
            notes: note,
          });
          break;
        }
        case "reject": {
          const reason = window.prompt(
            "Please provide a reason for rejection (required):",
            "Insufficient documentation"
          );
          if (!reason || !reason.trim()) {
            throw new Error("Rejection reason is required.");
          }
          await rejectVerificationMutation.mutateAsync({
            propertyId,
            reason: reason.trim(),
          });
          break;
        }
      }
      refetch(); // Refetch the list after action
    } catch (error) {
      console.error(`Failed to perform quick action ${action}:`, error);
      const err = error as any;
      showError(
        "Quick Action Failed",
        err?.message || err?.response?.data?.message || "An unexpected error occurred"
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Tabs */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as VerificationStatus | "all")
                }
                className={cn(
                  "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-teal-500 text-teal-600 dark:text-teal-400"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={cn(
                      "ml-2 rounded-full px-2 py-0.5 text-xs",
                      activeTab === tab.id
                        ? "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters Bar */}
        <div className="px-6 py-4">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search properties..."
                value={propertyFilters.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="mr-2 h-4 w-4" />
                Filters
              </Button>

              <Select
                value={propertyFilters.priority || ""}
                onChange={(e) =>
                  handlePriorityFilter(e.target.value as Priority | "")
                }
                className="w-32"
                options={[
                  { value: "", label: "All Priority" },
                  { value: "urgent", label: "Urgent" },
                  { value: "high", label: "High" },
                  { value: "normal", label: "Normal" },
                  { value: "low", label: "Low" },
                ]}
              />

              {/* Sort By */}
              <Select
                value={propertyFilters.sort_by || ""}
                onChange={(e) => {
                  setPropertyFilters({ sort_by: e.target.value || undefined });
                  setCurrentPage(1);
                }}
                className="w-40"
                options={[
                  { value: "", label: "Sort: Default" },
                  { value: "assigned_at", label: "Assigned Date" },
                  { value: "status", label: "Status" },
                  { value: "title", label: "Property Name" },
                ]}
              />

              {/* Sort Order */}
              <Select
                value={propertyFilters.sort_order || "desc"}
                onChange={(e) => {
                  setPropertyFilters({ sort_order: e.target.value as "asc" | "desc" });
                  setCurrentPage(1);
                }}
                className="w-28"
                options={[
                  { value: "asc", label: "Asc" },
                  { value: "desc", label: "Desc" },
                ]}
              />

              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <ArrowPathIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 md:grid-cols-3">
              <Select
                label="Property Type"
                value={propertyFilters.property_type || ""}
                onChange={(e) =>
                  setPropertyFilters({
                    property_type: e.target.value
                      ? (e.target.value as PropertyType)
                      : undefined,
                  })
                }
                options={[
                  { value: "", label: "All Types" },
                  { value: "Apartment", label: "Apartment" },
                  { value: "Villa", label: "Villa" },
                  { value: "Duplex", label: "Duplex" },
                  { value: "Land", label: "Land" },
                ]}
              />

              <Input
                type="date"
                label="From Date"
                value={propertyFilters.date_from || ""}
                onChange={(e) =>
                  setPropertyFilters({ date_from: e.target.value })
                }
              />

              <Input
                type="date"
                label="To Date"
                value={propertyFilters.date_to || ""}
                onChange={(e) =>
                  setPropertyFilters({ date_to: e.target.value })
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Properties List */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <AssignmentCardSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <Alert type="error" title="Failed to load properties">
            {error.message || "An error occurred while loading properties."}
          </Alert>
        ) : assignments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {assignments.map((assignment: PropertyAssignment) => (
              <PropertyAssignmentCard
                key={assignment.id}
                assignment={assignment}
                onQuickAction={handleQuickAction}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              No properties found for the selected filters
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {pagination.last_page}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(pagination.last_page, prev + 1)
                )
              }
              disabled={currentPage === pagination.last_page}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Export alias for backward compatibility
export const PropertyTaskQueueImproved = PropertyTaskQueue;
