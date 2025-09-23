import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { Badge } from "@components/ui/Badge";
import { LoadingSpinner } from "@components/ui/LoadingSpinner";
import { Alert } from "@components/ui/Alert";
import { PropertyVerification } from "@components/cs-agent/verification/PropertyVerification";
import { VerificationStatusUpdater } from "@components/cs-agent/verification/VerificationStatusUpdater";
import { DocumentUploader } from "@components/cs-agent/verification/DocumentUploader";
import { VerificationTimeline } from "@components/cs-agent/verification/VerificationTimeline";
import { usePropertyDetails } from "@hooks/cs-agent/usePropertyVerification";
import { useCsAgentUIStore } from "@store/cs-agent/csAgentStore";
import {
  HomeModernIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@utils/classNames";

export const PropertyVerificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const propertyId = parseInt(id || "0");

  const { setActivePage } = useCsAgentUIStore();
  const [activeTab, setActiveTab] = useState<
    "details" | "documents" | "timeline"
  >("details");

  // Enable polling for in-progress assignments
  const {
    data: assignment,
    isLoading,
    error,
  } = usePropertyDetails(
    propertyId,
    true // Enable polling for real-time updates
  );

  React.useEffect(() => {
    setActivePage("properties");
    if (assignment) {
      document.title = `Property Verification - ${assignment.title} - CS Agent - Semsary`;
    } else {
      document.title = "Property Verification - CS Agent - Semsary";
    }
  }, [setActivePage, assignment]);

  const getStatusColor = (
    status?: string
  ): "success" | "warning" | "primary" | "secondary" | "danger" => {
    switch (status) {
      case "pending":
        return "warning";
      case "in_progress":
        return "primary";
      case "completed":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" title="Failed to load property details">
        {error.message || "An error occurred while loading the property."}
      </Alert>
    );
  }

  if (!assignment) {
    return (
      <Alert type="warning" title="Property not found">
        The requested property could not be found.
      </Alert>
    );
  }

  // Normalize property data based on the actual API response structure
  // The API returns: { data: {...property details...}, assignment: {...assignment details...} }
  const propertyData = (assignment as any).data || assignment.property || assignment;
  const assignmentData = (assignment as any).assignment || assignment;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/cs-agent/properties")}
            className="p-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Property Verification
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              #{assignmentData.id || assignment.id} - {propertyData.title}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant={getStatusColor(assignmentData.status || assignment.status)} size="lg">
            {(assignmentData.formatted_status || assignmentData.status || assignment.status)?.replace("_", " ").toUpperCase()}
          </Badge>
          {(assignmentData.priority || assignment.priority) && (assignmentData.priority || assignment.priority) !== "normal" && (
            <Badge
              variant={(assignmentData.priority || assignment.priority) === "urgent" ? "danger" : "warning"}
              size="lg"
            >
              {(assignmentData.priority || assignment.priority).toUpperCase()}
            </Badge>
          )}
        </div>
      </div>

      {/* Property Overview Card */}
      <Card>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start space-x-3">
              <HomeModernIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Property Type
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {propertyData.type}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {typeof propertyData.location === "object" &&
                  propertyData.location
                    ? propertyData.location.full_address ||
                      propertyData.location.address
                    : propertyData.location || "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Owner
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {propertyData.owner?.name || "Unknown"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Assigned Date
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(assignmentData.assigned_at || assignment.assigned_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("details")}
            className={cn(
              "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
              activeTab === "details"
                ? "border-teal-500 text-teal-600 dark:text-teal-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            Property Details
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={cn(
              "flex items-center whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
              activeTab === "documents"
                ? "border-teal-500 text-teal-600 dark:text-teal-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            <DocumentTextIcon className="mr-2 h-4 w-4" />
            Documents
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={cn(
              "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium",
              activeTab === "timeline"
                ? "border-teal-500 text-teal-600 dark:text-teal-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            Timeline
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "details" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <div className="lg:col-span-2">
              <PropertyVerification property={propertyData} />
            </div>
            <div>
              {((assignmentData.status || assignment.status) === "in_progress" ||
                (assignmentData.status || assignment.status) === "pending") && (
                <VerificationStatusUpdater
                  assignmentId={assignmentData.id || assignment.id}
                  propertyId={propertyId}
                  currentStatus={assignmentData.status || assignment.status}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <DocumentUploader
            propertyId={propertyId}
            existingDocuments={propertyData.documents || assignment.documents || []}
            assignmentStatus={assignmentData.status || assignment.status}
          />
        )}

        {activeTab === "timeline" && (
          <VerificationTimeline
            assignmentId={assignmentData.id || assignment.id}
            propertyId={propertyId}
          />
        )}
      </div>
    </div>
  );
};
