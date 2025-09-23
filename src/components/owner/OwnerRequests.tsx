import React, { useEffect } from "react";
import { useRentRequests } from "@hooks/useRentRequest";
import { RentRequest } from "src/types";
import './OwnerRequests.css';
import { Col, Row } from "react-bootstrap";
import Loader from "@components/common/Loader/Loader";

type OwnerRequestsProps = {
  userId: number;
};

const OwnerRequests: React.FC<OwnerRequestsProps> = ({ userId }) => {
  const {
    ownerRentRequests,
    loading,
    error,
    fetchOwnerRentRequests,
    confirmRequest,
    rejectRequest,
    cancelConfirmedRequest,
  } = useRentRequests(userId);

  // Load owner requests on mount
  useEffect(() => {
    fetchOwnerRentRequests();
  }, [fetchOwnerRentRequests]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { 
        className: 'status-pending', 
        label: 'Pending Review',
        icon: 'fas fa-clock'
      },
      confirmed: { 
        className: 'status-confirmed', 
        label: 'Confirmed',
        icon: 'fas fa-check-circle'
      },
      cancelled: { 
        className: 'status-cancelled', 
        label: 'Cancelled',
        icon: 'fas fa-times-circle'
      },
      rejected: { 
        className: 'status-rejected', 
        label: 'Rejected',
        icon: 'fas fa-ban'
      },
      cancelled_by_owner: { 
        className: 'status-cancelled', 
        label: 'Cancelled by Owner',
        icon: 'fas fa-user-times'
      },
      paid: { 
        className: 'status-paid', 
        label: 'Paid',
        icon: 'fas fa-credit-card'
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { 
      className: 'status-default', 
      label: status,
      icon: 'fas fa-question'
    };
    
    return (
      <span className={`status-badge ${config.className}`}>
        <i className={config.icon}></i>
        {config.label}
      </span>
    );
  };

  const renderActions = (req: RentRequest) => {
    switch (req.status) {
      case "pending":
        return (
          <div className="action-buttons">
            <button
              onClick={() => confirmRequest(req.id)}
              className="action-btn confirm-btn"
              title="Confirm Request"
            >
              <i className="fas fa-check"></i>
              Confirm
            </button>
            <button
              onClick={() => rejectRequest(req.id)}
              className="action-btn reject-btn"
              title="Reject Request"
            >
              <i className="fas fa-times"></i>
              Reject
            </button>
          </div>
        );
      case "confirmed":
        return (
          <div className="action-buttons">
            <button
              onClick={() => cancelConfirmedRequest(req.id)}
              className="action-btn cancel-btn"
              title="Cancel Confirmed Request"
            >
              <i className="fas fa-undo"></i>
              Cancel Confirmed
            </button>
          </div>
        );
      case "cancelled":
      case "rejected":
      case "cancelled_by_owner":
        return (
        <span className="closed-label">
            <i className="fas fa-check-double"></i>
            Closed
          </span>
        );
      case "paid":
        return (
          <Row className="d-flex justify-content-between">
            <Col className="requester-info col-6 text-start">
                {req.user_info?.first_name} {req.user_info?.last_name}: {req.user_info?.phone_number}
            </Col>

            <Col className="paid-label col-6 text-end">
                <i className="fas fa-archive"></i>
                Paid
            </Col>
        </Row>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="requests-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
<Loader message="Loading requests..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="requests-container">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="requests-container">
      <div className="requests-header">
        <h2 className="requests-title">Owner Rent Requests</h2>
        <span className="requests-count">
          {ownerRentRequests.length} {ownerRentRequests.length === 1 ? 'request' : 'requests'}
        </span>
      </div>

      {ownerRentRequests.length === 0 ? (
        <div className="empty-requests">
          <i className="fas fa-inbox"></i>
          <h4>No requests found</h4>
          <p>When users request to rent your properties, they'll appear here.</p>
        </div>
      ) : (
        <div className="requests-list">
          {ownerRentRequests.map((req) => (
            <div key={req.id} className="request-item">
              <div className="request-content">
                <div className="request-info">
                  <div className="request-header-info">
                    <div className="request-id">
                      <i className="fas fa-hashtag"></i>
                      Request #{req.id}
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                  <h4 className="property-title">
                    {req.property?.title || 'Property Title'}
                  </h4>
                  <div className="request-details">
                    <div className="status-info">
                      <i className="fas fa-info-circle"></i>
                      <span>Status: {req.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="request-actions">
                {renderActions(req)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerRequests;