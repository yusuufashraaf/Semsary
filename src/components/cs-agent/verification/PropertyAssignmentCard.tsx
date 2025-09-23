import React from "react";
import { Link } from "react-router-dom";
import {
  ClockIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { PropertyAssignment } from "@app-types/cs-agent/cs-agent";
import { Card } from "@components/ui/Card";
import { Badge } from "@components/ui/Badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@utils/classNames";

interface PropertyAssignmentCardProps {
  assignment: PropertyAssignment;
  className?: string;
  showActions?: boolean;
  onQuickAction?: (
    assignmentId: number,
    action: "start" | "complete" | "reject"
  ) => void;
}

export const PropertyAssignmentCard: React.FC<PropertyAssignmentCardProps> = ({
  assignment,
  className,
  showActions = true,
  onQuickAction,
}) => {
  const { property, status, priority, assigned_at, started_at, completed_at } =
    assignment;

  // Handle both API structures - direct property data or nested property object
  const propertyData = property || assignment;

  // Status styling configuration
  const statusConfig = {
    pending: {
      variant: "warning" as const,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      icon: ClockIcon,
    },
    in_progress: {
      variant: "primary" as const,
      bgColor: "bg-blue-50 dark:bg-blue-900/10",
      borderColor: "border-blue-200 dark:border-blue-800",
      icon: ClockIcon,
    },
    completed: {
      variant: "success" as const,
      bgColor: "bg-green-50 dark:bg-green-900/10",
      borderColor: "border-green-200 dark:border-green-800",
      icon: ClockIcon,
    },
    rejected: {
      variant: "danger" as const,
      bgColor: "bg-red-50 dark:bg-red-900/10",
      borderColor: "border-red-200 dark:border-red-800",
      icon: ExclamationTriangleIcon,
    },
    cancelled: {
      variant: "secondary" as const,
      bgColor: "bg-gray-50 dark:bg-gray-900/10",
      borderColor: "border-gray-200 dark:border-gray-800",
      icon: ExclamationTriangleIcon,
    },
  };

  // Priority styling
  const priorityConfig = {
    low: { variant: "secondary" as const, text: "Low Priority" },
    normal: { variant: "secondary" as const, text: "Normal Priority" },
    high: { variant: "warning" as const, text: "High Priority" },
    urgent: { variant: "danger" as const, text: "Urgent" },
  };

  const currentStatus = statusConfig[status] || statusConfig.pending;
  const currentPriority = priorityConfig[priority] || priorityConfig.normal;

  // Calculate time information
  const timeAssigned = formatDistanceToNow(new Date(assigned_at), {
    addSuffix: true,
  });
  const timeStarted = started_at
    ? formatDistanceToNow(new Date(started_at), { addSuffix: true })
    : null;
  const timeCompleted = completed_at
    ? formatDistanceToNow(new Date(completed_at), { addSuffix: true })
    : null;

  // Check if assignment is overdue (more than 24 hours without progress)
  const isOverdue =
    status === "pending" &&
    Date.now() - new Date(assigned_at).getTime() > 24 * 60 * 60 * 1000;

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border",
        currentStatus.bgColor,
        currentStatus.borderColor,
        isOverdue && "ring-2 ring-red-300 ring-opacity-50",
        className
      )}
    >
      <div className="p-6">
        {/* Header with status and priority */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge variant={currentStatus.variant}>
              {assignment.formatted_status || status}
            </Badge>

            {priority !== "normal" && (
              <Badge variant={currentPriority.variant} size="sm">
                {currentPriority.text}
              </Badge>
            )}

            {isOverdue && (
              <Badge variant="danger" size="sm">
                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>

          {/* Property ID for quick reference */}
          {propertyData?.id && (
            <span className="text-xs text-gray-500 font-mono">
              #{propertyData.id}
            </span>
          )}
        </div>

        {/* Property Information */}
        <div className="mb-4">
          {propertyData?.title ? (
            <Link
              to={`/cs-agent/properties/${
                assignment.property_id || propertyData?.id || assignment.id
              }`}
              className="block group"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {propertyData.title}
              </h3>
            </Link>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Assignment #{assignment.id}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Property information not available
              </p>
            </div>
          )}

          {propertyData?.type && (
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <BuildingOfficeIcon className="w-4 h-4" />
                <span>{propertyData.type}</span>
              </div>

              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                <span className="truncate max-w-32">
                  {typeof propertyData.location === "object" &&
                  propertyData.location
                    ? propertyData.location.full_address ||
                      propertyData.location.address
                    : propertyData.location ||
                      (propertyData as any).address ||
                      "No address"}
                </span>
              </div>

              {propertyData.formatted_price && (
                <div className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  {propertyData.formatted_price}
                </div>
              )}
            </div>
          )}

          {propertyData?.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {propertyData.description}
            </p>
          )}
        </div>

        {/* Assignment Timeline */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <CalendarIcon className="w-3 h-3" />
            <span>Assigned {timeAssigned}</span>
          </div>

          {timeStarted && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="w-3 h-3" />
              <span>Started {timeStarted}</span>
            </div>
          )}

          {timeCompleted && (
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <ClockIcon className="w-3 h-3" />
              <span>Completed {timeCompleted}</span>
            </div>
          )}
        </div>

        {/* Property Owner Info */}
        {propertyData?.owner && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <UserIcon className="w-3 h-3" />
            <span>Owner: {propertyData.owner.name}</span>
          </div>
        )}

        {/* Notes Preview */}
        {assignment.notes && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {assignment.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && onQuickAction && (
          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            {status === "pending" && (
              <>
                <button
                  onClick={() =>
                    onQuickAction && onQuickAction(assignment.id, "start")
                  }
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                >
                  Start Verification
                </button>
                <button
                  onClick={() =>
                    onQuickAction && onQuickAction(assignment.id, "reject")
                  }
                  className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Reject
                </button>
              </>
            )}

            {status === "in_progress" && (
              <button
                onClick={() =>
                  onQuickAction && onQuickAction(assignment.id, "complete")
                }
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Mark Complete
              </button>
            )}

            <Link
              to={`/cs-agent/properties/${
                assignment.property_id || propertyData?.id || assignment.id
              }`}
              className="flex-1 px-3 py-2 text-sm font-medium text-center text-teal-600 dark:text-teal-400 border border-teal-300 dark:border-teal-700 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
            >
              View Details
            </Link>
          </div>
        )}

        {/* View Details link when no actions */}
        {(!showActions || !onQuickAction) && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to={`/cs-agent/properties/${
                assignment.property_id || propertyData?.id || assignment.id
              }`}
              className="block w-full px-3 py-2 text-sm font-medium text-center text-teal-600 dark:text-teal-400 border border-teal-300 dark:border-teal-700 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
            >
              View Full Details
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

// Compact version of the card for lists
interface CompactPropertyCardProps {
  assignment: PropertyAssignment;
  onClick?: () => void;
  className?: string;
}

export const CompactPropertyCard: React.FC<CompactPropertyCardProps> = ({
  assignment,
  onClick,
  className,
}) => {
  const { property, status, priority } = assignment;

  const statusConfig = {
    pending: {
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    in_progress: {
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    completed: {
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/20",
    },
    rejected: {
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-900/20",
    },
    cancelled: {
      color: "text-gray-600 dark:text-gray-400",
      bg: "bg-gray-100 dark:bg-gray-900/20",
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.pending;

  return (
    <div
      className={cn(
        "flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {/* Status indicator */}
      <div className={cn("w-3 h-3 rounded-full mr-3", currentStatus.bg)} />

      {/* Property info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {property?.title || `Assignment #${assignment.id}`}
          </h4>
          {priority === "urgent" && (
            <Badge variant="danger" size="sm">
              Urgent
            </Badge>
          )}
          {priority === "high" && (
            <Badge variant="warning" size="sm">
              High
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {property
            ? `${property.type} • ${property.location || "No location"}`
            : "Property information not available"}
        </p>
      </div>

      {/* Status badge */}
      <Badge
        variant={
          status === "completed"
            ? "success"
            : status === "rejected"
            ? "danger"
            : "warning"
        }
        size="sm"
      >
        {assignment.formatted_status || status}
      </Badge>
    </div>
  );
};

// Grid layout for assignment cards
interface PropertyAssignmentGridProps {
  assignments: PropertyAssignment[];
  isLoading?: boolean;
  onQuickAction?: (
    assignmentId: number,
    action: "start" | "complete" | "reject"
  ) => void;
  className?: string;
}

export const PropertyAssignmentGrid: React.FC<PropertyAssignmentGridProps> = ({
  assignments,
  isLoading = false,
  onQuickAction,
  className,
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          className
        )}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No assignments found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          You don't have any property assignments matching the current filters.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {assignments.map((assignment) => (
        <PropertyAssignmentCard
          key={assignment.id}
          assignment={assignment}
          onQuickAction={onQuickAction}
        />
      ))}
    </div>
  );
};
