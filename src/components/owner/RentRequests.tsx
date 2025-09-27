import React, { useEffect } from "react";
import { useRentRequests } from "@hooks/useRentRequest";
import { RentRequest } from "src/types";
import "./RentRequests.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type RequestsProps = {
  userId: number;
};

const OwnerRequests: React.FC<RequestsProps> = ({ userId }) => {
  const navigate = useNavigate();
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
    payForRentRequest,
    ownerPagination,
    userPagination,
  } = useRentRequests(userId);

  // Load both owner & user requests on mount
  useEffect(() => {
    fetchOwnerRentRequests();
    fetchUserRentRequests();
  }, [fetchOwnerRentRequests, fetchUserRentRequests]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        className: "status-pending",
        label: "Pending",
        icon: "fas fa-clock",
      },
      confirmed: {
        className: "status-confirmed",
        label: "Confirmed",
        icon: "fas fa-check-circle",
      },
      cancelled: {
        className: "status-cancelled",
        label: "Cancelled",
        icon: "fas fa-times-circle",
      },
      rejected: {
        className: "status-rejected",
        label: "Rejected",
        icon: "fas fa-ban",
      },
      cancelled_by_owner: {
        className: "status-cancelled",
        label: "Cancelled",
        icon: "fas fa-user-times",
      },
      paid: {
        className: "status-paid",
        label: "Paid",
        icon: "fas fa-credit-card",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || {
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
            <button
              onClick={() => confirmRequest(req.id)}
              className="action-btn confirm-btn"
            >
              <i className="fas fa-check"></i> Confirm
            </button>
            <button
              onClick={() => rejectRequest(req.id)}
              className="action-btn reject-btn"
            >
              <i className="fas fa-times"></i> Reject
            </button>
          </div>
        );
      case "confirmed":
        return (
          <button
            onClick={() => cancelConfirmedRequest(req.id)}
            className="action-btn cancel-btn"
          >
            <i className="fas fa-undo"></i> Cancel Confirmed
          </button>
        );
      default:
        return <div className="request-actions">Closed</div>;
    }
  };

  // Render actions for User side
  const renderUserActions = (req: RentRequest) => {
    switch (req.status) {
      case "confirmed":
        return (
          <div className="action-buttons">
            <button
              onClick={() => cancelRequest(req.id)}
              className="action-btn cancel-btn"
            >
              <i className="fas fa-times"></i> Cancel Request
            </button>
<button
  onClick={async () => {
    try {
      const checkIn = new Date(req.check_in);
      const checkOut = new Date(req.check_out);
      const days = Math.max(
        1,
        Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );


      const idempotency_key = `${req.id}-${userId}-${Date.now()}`;

      const result = await payForRentRequest(req.id, {
        idempotency_key,

      });

      if (result?.data?.redirect_url) {
        window.location.href = result.redirect_url;
      } else if (result?.success) {
        toast.success("Payment successful!");
      }
    } catch (err) {
      toast.error("Payment failed");
    }
  }}
  className="action-btn pay-btn"
>
  <i className="fas fa-credit-card"></i> Pay
</button>
          </div>
        );
      case "paid":
        return (
          <span className="status-badge status-paid">
            <i className="fas fa-check-circle"></i> Paid
          </span>
        );
      default:
        return <div className="request-actions">Closed</div>;
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
                    <div className="request-header-info">
                      <div className="request-id">
                        <i className="fas fa-hashtag"></i> Request #{req.id}
                      </div>
                      {getStatusBadge(req.status)}
                    </div>

                    <h4 className="property-title"
                    onClick={() => navigate(`/property/${req.property?.id}`)}
                    >
                      {req.property?.title || "Property Title"}
                    </h4>
                    <div className="location">
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      {req.property?.location?.address || "Property Location"}
                    </div>
                  </div>
                </div>

                <div className="request-actions">
                  {renderOwnerActions(req)}
                </div>

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

          <div className="pagination">
            <button
              className="page-btn"
              disabled={(ownerPagination?.current_page ?? 1) === 1}
              onClick={() =>
                fetchOwnerRentRequests({
                  page: (ownerPagination?.current_page ?? 1) - 1,
                })
              }
            >
              <i className="fas fa-chevron-left"></i> Prev
            </button>

            <span className="page-info">
              Page {ownerPagination?.current_page ?? 1} of{" "}
              {ownerPagination?.last_page ?? 1}
            </span>

            <button
              className="page-btn"
              disabled={
                (ownerPagination?.current_page ?? 1) ===
                (ownerPagination?.last_page ?? 1)
              }
              onClick={() =>
                fetchOwnerRentRequests({
                  page: (ownerPagination?.current_page ?? 1) + 1,
                })
              }
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
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

          <div className="pagination">
            <button
              className="page-btn"
              disabled={(userPagination?.current_page ?? 1) === 1}
              onClick={() =>
                fetchUserRentRequests({
                  page: (userPagination?.current_page ?? 1) - 1,
                })
              }
            >
              <i className="fas fa-chevron-left"></i> Prev
            </button>

            <span className="page-info">
              Page {userPagination?.current_page ?? 1} of{" "}
              {userPagination?.last_page ?? 1}
            </span>

            <button
              className="page-btn"
              disabled={
                (userPagination?.current_page ?? 1) ===
                (userPagination?.last_page ?? 1)
              }
              onClick={() =>
                fetchUserRentRequests({
                  page: (userPagination?.current_page ?? 1) + 1,
                })
              }
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </>
      )}
      {userRentRequests.length === 0 && ownerRentRequests.length === 0 &&(
        <div className="no-requests">
          <div className="icon-wrapper">
            <div className="no-requests-icon"></div>
          </div>
            <h2 className="no-requests-title">No rent requests found</h2>
          </div>
      )}
    </div>
  );
};

export default OwnerRequests;
