import React, { useEffect } from "react";
import { useRentRequests } from "@hooks/useRentRequest";
import { RentRequest } from "src/types";
import "./RentRequests.css";

type RequestsProps = {
  userId: number;
};

const OwnerRequests: React.FC<RequestsProps> = ({ userId }) => {
  const {
    ownerRentRequests,
    userRentRequests,
    loading,
    error,
    fetchOwnerRentRequests,
    fetchUserRentRequests,
    confirmRequest,
    rejectRequest,
    cancelConfirmedRequest,
    cancelRequest,
  } = useRentRequests(userId);

  // Load both owner & user requests on mount
  useEffect(() => {
    fetchOwnerRentRequests();
    fetchUserRentRequests();
  }, [fetchOwnerRentRequests, fetchUserRentRequests]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { className: "status-pending", label: "Pending", icon: "fas fa-clock" },
      confirmed: { className: "status-confirmed", label: "Confirmed", icon: "fas fa-check-circle" },
      cancelled: { className: "status-cancelled", label: "Cancelled", icon: "fas fa-times-circle" },
      rejected: { className: "status-rejected", label: "Rejected", icon: "fas fa-ban" },
      cancelled_by_owner: { className: "status-cancelled", label: "Cancelled by Owner", icon: "fas fa-user-times" },
      paid: { className: "status-paid", label: "Paid", icon: "fas fa-credit-card" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      className: "status-default",
      label: status,
      icon: "fas fa-question",
    };

    return (
      <span className={`status-badge ${config.className}`}>
        <i className={config.icon}></i> {config.label}
      </span>
    );
  };

  // Render actions for Owner side
  const renderOwnerActions = (req: RentRequest) => {
    switch (req.status) {
      case "pending":
        return (
          <div className="action-buttons">
            <button onClick={() => confirmRequest(req.id)} className="action-btn confirm-btn">
              <i className="fas fa-check"></i> Confirm
            </button>
            <button onClick={() => rejectRequest(req.id)} className="action-btn reject-btn">
              <i className="fas fa-times"></i> Reject
            </button>
          </div>
        );
      case "confirmed":
        return (
          <button onClick={() => cancelConfirmedRequest(req.id)} className="action-btn cancel-btn">
            <i className="fas fa-undo"></i> Cancel Confirmed
          </button>
        );
      default:
        return (
             <div className="request-actions">
                Closed
             </div>
        );
    }
  };

  // Render actions for User side
  const renderUserActions = (req: RentRequest) => {
    switch (req.status) {
      case "confirmed":
        return (
          <button onClick={() => cancelRequest(req.id)} className="action-btn cancel-btn">
            <i className="fas fa-times"></i> Cancel Request
          </button>
        );
      case "confirmed":
        return (
          <span className="status-badge status-confirmed">
            <i className="fas fa-check-circle"></i> Confirmed
          </span>
        );
      case "paid":
        return (
          <span className="status-badge status-paid">
            <i className="fas fa-credit-card"></i> Paid
          </span>
        );
      default:
        return (
             <div className="request-actions">
                Closed
             </div>
        );
    }
  };

  if (loading) {
    return <div className="loading-state">Loading requests...</div>;
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  return (
  <div className="requests-container">
    {/* Owner Requests */}
    {ownerRentRequests.length > 0 && (
      <>
        <div className="requests-header">
          <h2 className="requests-title">Requests to Your Properties</h2>
          <span className="requests-count">
            {ownerRentRequests.length}{" "}
            {ownerRentRequests.length === 1 ? "request" : "requests"}
          </span>
        </div>

        <div className="requests-list">
          {ownerRentRequests.map((req) => (
            <div key={req.id} className="request-item">
              <div className="request-content">
                <div className="request-info">
                  {/* Header Info: Request ID + Status Badge */}
                  <div className="request-header-info">
                    <div className="request-id">
                      <i className="fas fa-hashtag"></i> Request #{req.id}
                    </div>
                    {getStatusBadge(req.status)}
                  </div>

                  <h4 className="property-title">
                    {req.property?.title || "Property Title"}
                  </h4>

                  <div className="location">
                    <i className="fas fa-map-marker-alt"></i>{" "}
                    {req.property?.location?.address || "Property Location"}
                  </div>
                </div>
              </div>

              <div className="request-actions">{renderOwnerActions(req)}</div>

              <div className="username">
                <i className="fas fa-user" style={{ fontSize: "14px" }}></i>
                Requested by: {req.user_info.first_name}{" "}
                {req.user_info.last_name}
                {req.status === "paid" && (
                  <>
                    {" - "}
                    <i className="fas fa-phone"></i>{" "}
                    {req.user_info.phone_number}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    )}

    {/* User Requests */}
    {userRentRequests.length > 0 && (
      <>
        <div className="requests-header">
          <h2 className="requests-title">Your Rent Requests</h2>
          <span className="requests-count">
            {userRentRequests.length}{" "}
            {userRentRequests.length === 1 ? "request" : "requests"}
          </span>
        </div>

        <div className="requests-list">
          {userRentRequests.map((req) => (
            <div key={req.id} className="request-item">
              <div className="request-content">
                <div className="request-info">
                  {/* Header Info: Request ID + Status Badge */}
                  <div className="request-header-info">
                    <div className="request-id">
                      <i className="fas fa-hashtag"></i> Request #{req.id}
                    </div>
                    {getStatusBadge(req.status)}
                  </div>

                  <h4 className="property-title">
                    {req.property?.title || "Property Title"}
                  </h4>

                  <div className="location">
                    <i className="fas fa-map-marker-alt"></i>{" "}
                    {req.property?.location?.address || "Property Location"}
                  </div>
                </div>
              </div>

              <div className="request-actions">{renderUserActions(req)}</div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

};

export default OwnerRequests;
