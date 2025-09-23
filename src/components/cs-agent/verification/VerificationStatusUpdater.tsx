import React, { useState } from "react";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { Badge } from "@components/ui/Badge";
import { LoadingSpinner } from "@components/ui/LoadingSpinner";
import {
  useCompleteVerification,
  useRejectVerification,
  useStartVerification,
  useUpdateVerificationStatus,
} from "@hooks/cs-agent/usePropertyVerification";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  PlayIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type { VerificationStatus } from "@app-types/cs-agent/cs-agent";

interface VerificationStatusUpdaterProps {
  assignmentId: number;
  propertyId: number;
  currentStatus: VerificationStatus;
}

// Define valid status transitions
const STATUS_TRANSITIONS: Record<VerificationStatus, VerificationStatus[]> = {
  pending: ["in_progress"],
  in_progress: ["completed", "rejected"],
  completed: [], // Terminal state
  rejected: ["in_progress"], // Allow re-verification
  cancelled: [], // Terminal state
};

const STATUS_CONFIGS = {
  pending: {
    label: "Pending Review",
    color: "warning" as const,
    icon: ClockIcon,
  },
  in_progress: {
    label: "In Progress",
    color: "primary" as const,
    icon: PlayIcon,
  },
  completed: {
    label: "Completed",
    color: "success" as const,
    icon: CheckCircleIcon,
  },
  rejected: {
    label: "Rejected",
    color: "danger" as const,
    icon: XCircleIcon,
  },
  cancelled: {
    label: "Cancelled",
    color: "secondary" as const,
    icon: ExclamationTriangleIcon,
  },
};

export const VerificationStatusUpdater: React.FC<
  VerificationStatusUpdaterProps
> = ({ propertyId, currentStatus }) => {
  const [notes, setNotes] = useState("");
  const [selectedNextStatus, setSelectedNextStatus] =
    useState<VerificationStatus | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const startVerification = useStartVerification();
  const completeVerification = useCompleteVerification();
  const rejectVerification = useRejectVerification();
  const updateStatus = useUpdateVerificationStatus();

  const availableTransitions = STATUS_TRANSITIONS[currentStatus] || [];
  const currentConfig = STATUS_CONFIGS[currentStatus];

  const isLoading =
    startVerification.isPending ||
    completeVerification.isPending ||
    rejectVerification.isPending ||
    updateStatus.isPending;

  const handleStatusUpdate = async (nextStatus: VerificationStatus) => {
    if (!notes.trim() && nextStatus !== "in_progress") {
      alert("Please add notes before updating status.");
      return;
    }

    try {
      switch (nextStatus) {
        case "in_progress":
          await startVerification.mutateAsync(propertyId);
          break;
        case "completed":
          await completeVerification.mutateAsync({ propertyId, notes });
          break;
        case "rejected":
          await rejectVerification.mutateAsync({ propertyId, reason: notes });
          break;
        default:
          await updateStatus.mutateAsync({
            propertyId,
            data: { status: nextStatus, notes },
          });
      }

      // Reset form
      setNotes("");
      setSelectedNextStatus(null);
      setIsConfirming(false);
    } catch (error) {
      // Error handled by the hooks
    }
  };

  const handleTransitionClick = (nextStatus: VerificationStatus) => {
    setSelectedNextStatus(nextStatus);
    setIsConfirming(true);
  };

  const resetForm = () => {
    setSelectedNextStatus(null);
    setIsConfirming(false);
    setNotes("");
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <ClockIcon className="mr-2 h-5 w-5" />
          Update Verification Status
        </h3>

        <div className="space-y-4">
          {/* Current Status Display */}
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Current Status
            </p>
            <div className="flex items-center mt-1">
              <currentConfig.icon className="h-4 w-4 mr-2" />
              <Badge variant={currentConfig.color} size="sm">
                {currentConfig.label}
              </Badge>
            </div>
          </div>

          {/* Available Transitions */}
          {availableTransitions.length > 0 && !isConfirming && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Available Actions
              </p>
              <div className="space-y-2">
                {availableTransitions.map((status) => {
                  const config = STATUS_CONFIGS[status];
                  const Icon = config.icon;
                  return (
                    <Button
                      key={status}
                      variant="outline"
                      onClick={() => handleTransitionClick(status)}
                      disabled={isLoading}
                      className="w-full justify-start"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      Move to {config.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Confirmation Form */}
          {isConfirming && selectedNextStatus && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-center mb-3">
                {React.createElement(STATUS_CONFIGS[selectedNextStatus].icon, {
                  className: "h-5 w-5 mr-2 text-blue-600",
                })}
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Update to {STATUS_CONFIGS[selectedNextStatus].label}
                </h4>
              </div>

              {/* Notes Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                  <DocumentTextIcon className="inline h-4 w-4 mr-1" />
                  {selectedNextStatus === "rejected"
                    ? "Rejection Reason"
                    : "Verification Notes"}
                  {selectedNextStatus !== "in_progress" && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-blue-700 dark:bg-blue-900/30 dark:text-white"
                  placeholder={
                    selectedNextStatus === "rejected"
                      ? "Please provide a detailed reason for rejection..."
                      : selectedNextStatus === "completed"
                      ? "Add verification completion notes..."
                      : "Add notes about the verification process..."
                  }
                  disabled={isLoading}
                />
              </div>

              {/* Quick Actions for notes */}
              {selectedNextStatus === "completed" && (
                <div className="mb-4">
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNotes(
                          notes +
                            (notes ? "\n" : "") +
                            "- Property details verified"
                        )
                      }
                      disabled={isLoading}
                    >
                      Details OK
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNotes(
                          notes +
                            (notes ? "\n" : "") +
                            "- Owner information confirmed"
                        )
                      }
                      disabled={isLoading}
                    >
                      Owner OK
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNotes(
                          notes +
                            (notes ? "\n" : "") +
                            "- Images match property"
                        )
                      }
                      disabled={isLoading}
                    >
                      Images OK
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNotes(
                          notes + (notes ? "\n" : "") + "- Location verified"
                        )
                      }
                      disabled={isLoading}
                    >
                      Location OK
                    </Button>
                  </div>
                </div>
              )}

              {/* Confirmation Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  onClick={() => handleStatusUpdate(selectedNextStatus)}
                  disabled={
                    isLoading ||
                    (selectedNextStatus !== "in_progress" && !notes.trim())
                  }
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      {React.createElement(
                        STATUS_CONFIGS[selectedNextStatus].icon,
                        {
                          className: "h-4 w-4 mr-2",
                        }
                      )}
                      Confirm Update
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* No actions available */}
          {availableTransitions.length === 0 && !isConfirming && (
            <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-700/50">
              <CheckCircleIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No further actions available for this assignment.
              </p>
            </div>
          )}

          {/* Help Text */}
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>Status Flow:</strong> Pending → In Progress →
              Completed/Rejected
              <br />
              <strong>Note:</strong> All status changes are logged in the
              verification timeline.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
