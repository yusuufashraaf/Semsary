import React from "react";
import { Card } from "@components/ui/Card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@components/ui/Badge";
import { LoadingSpinner } from "@components/ui/LoadingSpinner";
import { Alert } from "@components/ui/Alert";
import {
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserIcon,
  ExclamationCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@utils/classNames";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { csAgentApi } from "@api/endpoints/csAgent";
import { VerificationTimelineItem } from "@app-types/cs-agent/cs-agent"; // Assuming this type exists or will be created

interface VerificationTimelineProps {
  assignmentId: number;
  propertyId: number;
}

export const VerificationTimeline: React.FC<VerificationTimelineProps> = ({
  assignmentId: _assignmentId,
  propertyId,
}) => {
  const queryClient = useQueryClient();
  const [noteContent, setNoteContent] = React.useState("");
  const [noteError, setNoteError] = React.useState<string | null>(null);

  const {
    data: timelineData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cs-agent", "property", propertyId, "timeline"],
    queryFn: () => csAgentApi.getVerificationTimeline(propertyId),
    enabled: !!propertyId,
  });

  const addNoteMutation = useMutation({
    mutationFn: (note: string) => csAgentApi.addNote(propertyId, note),
    onSuccess: () => {
      setNoteContent("");
      queryClient.invalidateQueries({
        queryKey: ["cs-agent", "property", propertyId, "timeline"],
      });
      // Optionally, invalidate property details to show updated notes
      queryClient.invalidateQueries({
        queryKey: ["cs-agent", "property", propertyId],
      });
    },
    onError: (err) => {
      console.error("Failed to add note:", err);
      const is404 = (err as any)?.response?.status === 404;
      if (is404) {
        // Note API not implemented yet, show user-friendly message
        setNoteError("Note functionality is currently being set up. Please check back later.");
      } else {
        setNoteError((err as any)?.response?.data?.message || (err as any)?.message || "Failed to add note");
      }
    },
  });

  const timelineEvents: VerificationTimelineItem[] = timelineData?.data || [];

  const getEventIcon = (type: VerificationTimelineItem["type"]) => {
    switch (type) {
      case "status_change":
        return ClockIcon;
      case "document_upload":
        return DocumentTextIcon;
      case "note_added":
        return DocumentTextIcon;
      case "assignment":
        return UserIcon;
      case "completion":
        return CheckCircleIcon;
      default:
        return ExclamationCircleIcon;
    }
  };

  const getEventColor = (type: VerificationTimelineItem["type"]) => {
    switch (type) {
      case "status_change":
        return "blue";
      case "document_upload":
        return "green";
      case "note_added":
        return "gray";
      case "assignment":
        return "purple";
      case "completion":
        return "green";
      default:
        return "gray";
    }
  };

  const handleAddNote = () => {
    if (noteContent.trim()) {
      addNoteMutation.mutate(noteContent.trim());
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  if (error) {
    const is404 = (error as any)?.response?.status === 404;
    return (
      <Card>
        <Alert 
          type={is404 ? "warning" : "error"} 
          title={is404 ? "Timeline Not Available" : "Failed to load timeline"}
        >
          {is404 
            ? "The verification timeline feature is currently being set up. Please check back later."
            : (error as any)?.message || "An error occurred while loading the verification timeline."
          }
        </Alert>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Verification Timeline
        </h3>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />

          {/* Timeline Events */}
          <div className="space-y-6">
            {timelineEvents.length > 0 ? (
              timelineEvents.map((event, index) => {
                const Icon = getEventIcon(event.type);
                const color = getEventColor(event.type);
                const isLast = index === timelineEvents.length - 1;

                return (
                  <div key={event.id} className="relative flex items-start">
                    {/* Timeline Dot */}
                    <div
                      className={cn(
                        "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white dark:border-gray-800",
                        color === "blue" && "bg-blue-100 dark:bg-blue-900/50",
                        color === "green" &&
                          "bg-green-100 dark:bg-green-900/50",
                        color === "purple" &&
                          "bg-purple-100 dark:bg-purple-900/50",
                        color === "gray" && "bg-gray-100 dark:bg-gray-800"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          color === "blue" &&
                            "text-blue-600 dark:text-blue-400",
                          color === "green" &&
                            "text-green-600 dark:text-green-400",
                          color === "purple" &&
                            "text-purple-600 dark:text-purple-400",
                          color === "gray" && "text-gray-600 dark:text-gray-400"
                        )}
                      />
                    </div>

                    {/* Event Content */}
                    <div className="ml-6 flex-1">
                      <div
                        className={cn(
                          "rounded-lg border p-4",
                          isLast
                            ? "border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-900/20"
                            : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                        )}
                      >
                        {/* Event Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {event.action}
                            </h4>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {event.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(new Date(event.timestamp), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Event Metadata */}
                        {event.metadata && (
                          <div className="mt-3">
                            {event.metadata.old_status &&
                              event.metadata.new_status && (
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" size="sm">
                                    {event.metadata.old_status}
                                  </Badge>
                                  <span className="text-gray-400">→</span>
                                  <Badge
                                    variant={
                                      event.metadata.new_status === "completed"
                                        ? "success"
                                        : event.metadata.new_status ===
                                          "in_progress"
                                        ? "primary"
                                        : "warning"
                                    }
                                    size="sm"
                                  >
                                    {event.metadata.new_status}
                                  </Badge>
                                </div>
                              )}

                            {event.metadata.documents && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                <DocumentTextIcon className="inline h-3 w-3 mr-1" />
                                {event.metadata.documents} document(s) uploaded
                              </p>
                            )}

                            {event.metadata.note && (
                              <div className="mt-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
                                <p className="text-xs text-gray-700 dark:text-gray-300">
                                  {event.metadata.note}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Event User */}
                        <div className="mt-3 flex items-center space-x-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                            <UserIcon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {event.user_name} ({event.user_role})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No timeline events found for this assignment.
              </div>
            )}
          </div>

          {/* Add Note Section */}
          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Add a Note to Timeline
            </h4>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                disabled={addNoteMutation.isPending}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => {
                  setNoteError(null);
                  handleAddNote();
                }}
                disabled={!noteContent.trim() || addNoteMutation.isPending}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50 flex items-center"
              >
                {addNoteMutation.isPending ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                )}
                Add Note
              </button>
            </div>
            {(addNoteMutation.isError || noteError) && (
              <p className="text-red-500 text-xs mt-2">
                {noteError || `Failed to add note: ${(addNoteMutation.error as any)?.message || "Unknown error"}`}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
