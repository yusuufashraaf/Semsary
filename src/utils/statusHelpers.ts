import {
  UserStatus,
  PropertyState,
  TransactionStatus,
} from "@app-types/admin/admin";

/**
 * Get status color variant
 */
export const getStatusVariant = (
  status: UserStatus | PropertyState | TransactionStatus
): "success" | "warning" | "danger" | "secondary" | "primary" => {
  const statusMap: Record<
    string,
    "success" | "warning" | "danger" | "secondary" | "primary"
  > = {
    // User statuses
    active: "success",
    inactive: "secondary",
    pending: "warning",
    suspended: "danger",

    // Property statuses
    Valid: "success",
    Approved: "success",
    Pending: "warning",
    Rejected: "danger",
    Rented: "primary",
    Sold: "success",

    // Transaction statuses
    success: "success",
    pending_transaction: "warning",
    failed: "danger",
    refunded: "secondary",
  };

  return statusMap[status] || "secondary";
};

/**
 * Get status display text
 */
export const getStatusText = (status: string): string => {
  const statusTextMap: Record<string, string> = {
    // User statuses
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    suspended: "Suspended",

    // Property statuses
    Valid: "Valid",
    Pending: "Pending Review",
    Rented: "Rented",
    Sold: "Sold",

    // Transaction statuses
    success: "Completed",
    pending_transaction: "Pending",
    failed: "Failed",
    refunded: "Refunded",
  };

  return statusTextMap[status] || status;
};
