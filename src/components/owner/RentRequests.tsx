import React, { useEffect, useState } from "react";
import { useRentRequests } from "@hooks/useRentRequest";
import { useCheckouts } from "@hooks/useCheckout";
import { RentRequest } from "src/types";
import "./RentRequests.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "@components/common/Loader/Loader";

type RequestsProps = {
  userId: number;
};

// Enhanced Modal Component with Bootstrap styling
const InputModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  placeholder, 
  required = false,
  type = "text"
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  placeholder: string;
  required?: boolean;
  type?: "text" | "textarea";
}) => {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (required && !value.trim()) {
      toast.warning(`${title} is required`);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onConfirm(value);
      setValue("");
      onClose();
    } catch (error) {
      // Error is handled in the onConfirm function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setValue("");
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isSubmitting) {
      handleClose();
    }
    if (e.key === 'Enter' && e.ctrlKey && !isSubmitting) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="input-modal-overlay" onClick={!isSubmitting ? handleClose : undefined}>
      <div className="input-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="input-modal-header">
          <h3 className="input-modal-title">{title}</h3>
          <button 
            className="input-modal-close" 
            onClick={handleClose}
            disabled={isSubmitting}
            type="button"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="input-modal-body">
          {type === "textarea" ? (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="input-modal-input"
              rows={4}
              autoFocus
              disabled={isSubmitting}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="input-modal-input"
              autoFocus
              disabled={isSubmitting}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>
        <div className="input-modal-footer">
          <button 
            className="input-modal-btn input-modal-btn-secondary" 
            onClick={handleClose}
            disabled={isSubmitting}
            type="button"
          >
            Cancel
          </button>
          <button 
            className="input-modal-btn input-modal-btn-primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Processing...
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const OwnerRequests: React.FC<RequestsProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [checkoutStatuses, setCheckoutStatuses] = useState<{[key: number]: any}>({});
  const [loadingCheckoutStatuses, setLoadingCheckoutStatuses] = useState<{[key: number]: boolean}>({});
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    placeholder: "",
    required: false,
    type: "text" as "text" | "textarea",
    onConfirm: (value: string) => {}
  });

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

  const {
    currentCheckout,
    loading: checkoutLoading,
    error: checkoutError,
    requestCheckout,
    fetchCheckoutStatus,
    ownerConfirm,
    ownerReject,
    clearError: clearCheckoutError,
  } = useCheckouts(userId);

  // Load both owner & user requests on mount
  useEffect(() => {
    fetchOwnerRentRequests();
    fetchUserRentRequests();
  }, [fetchOwnerRentRequests, fetchUserRentRequests]);

  // Fetch checkout statuses for paid/completed rentals
  useEffect(() => {
    const fetchAllCheckoutStatuses = async () => {
      const allRequests = [...ownerRentRequests, ...userRentRequests];
      const paidRequests = allRequests.filter(req => 
        req.status === 'paid' || req.status === 'completed'
      );
      
      if (paidRequests.length === 0) {
        return;
      }

      // Set loading state for each request
      const loadingMap: {[key: number]: boolean} = {};
      paidRequests.forEach(req => {
        loadingMap[req.id] = true;
      });
      setLoadingCheckoutStatuses(loadingMap);

      const statusPromises = paidRequests.map(async (req) => {
        try {
          const response = await fetchCheckoutStatus(req.id);
          return { rentRequestId: req.id, status: response };
        } catch (error) {
          return { rentRequestId: req.id, status: null };
        }
      });

      const results = await Promise.all(statusPromises);
      const statusMap: {[key: number]: any} = {};
      const finalLoadingMap: {[key: number]: boolean} = {};
      
      results.forEach(result => {
        if (result.status?.success) {
          statusMap[result.rentRequestId] = result.status.data;
        }
        finalLoadingMap[result.rentRequestId] = false;
      });

      setCheckoutStatuses(statusMap);
      setLoadingCheckoutStatuses(finalLoadingMap);
    };

    if (ownerRentRequests.length > 0 || userRentRequests.length > 0) {
      fetchAllCheckoutStatuses();
    }
  }, [ownerRentRequests, userRentRequests]);

  // Clear checkout errors when they appear
  useEffect(() => {
    if (checkoutError) {
      toast.error(checkoutError);
      clearCheckoutError();
    }
  }, [checkoutError, clearCheckoutError]);

  const openModal = (config: Partial<typeof modalConfig>) => {
    setModalConfig({
      isOpen: true,
      title: "",
      placeholder: "",
      required: false,
      type: "text",
      onConfirm: (value: string) => {},
      ...config
    });
  };

  const closeModal = () => {
    setModalConfig({
      ...modalConfig,
      isOpen: false
    });
  };

  // Refresh checkout status after actions
  const refreshCheckoutStatus = async (rentRequestId: number) => {
    try {
      setLoadingCheckoutStatuses(prev => ({ ...prev, [rentRequestId]: true }));
      const response = await fetchCheckoutStatus(rentRequestId);
      if (response?.success) {
        setCheckoutStatuses(prev => ({
          ...prev,
          [rentRequestId]: response.data
        }));
      }
    } catch (error) {
      console.log(`Could not refresh checkout status for request ${rentRequestId}`);
    } finally {
      setLoadingCheckoutStatuses(prev => ({ ...prev, [rentRequestId]: false }));
    }
  };

  const canUserAccessCheckoutAction = (req: RentRequest, action: string, checkoutStatus?: any): boolean => {
    const isRenter = req.user_id === userId;
    const isOwner = req.property?.owner_id === userId;
    
    switch (action) {
      case 'request_checkout':
        return isRenter && req.status === 'paid' && (!checkoutStatus || !checkoutStatus.checkout);
      
      case 'owner_confirm':
      case 'owner_reject':
        return isOwner && 
               checkoutStatus && 
               checkoutStatus.checkout && 
               checkoutStatus.checkout.owner_confirmation === 'pending';
      
      default:
        return false;
    }
  };

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
      completed: {
        className: "status-completed",
        label: "Completed",
        icon: "fas fa-check-double",
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

  // Handle checkout request
  const handleCheckoutRequest = async (rentRequestId: number) => {
    openModal({
      title: "Request Checkout",
      placeholder: "Please provide a reason for checkout (optional)",
      required: false,
      type: "textarea",
      onConfirm: async (reason: string) => {
        const response = await requestCheckout(rentRequestId, reason || undefined);
        if (response?.success) {
          toast.success(response.message || "Checkout requested successfully!");
          fetchUserRentRequests();
          await refreshCheckoutStatus(rentRequestId);
        } else {
          throw new Error("Failed to request checkout");
        }
      }
    });
  };

  // Handle owner checkout confirmation
  const handleOwnerCheckoutConfirm = async (rentRequestId: number) => {
    openModal({
      title: "Confirm Checkout",
      placeholder: "Any damage notes? (Leave empty if no damages)",
      required: false,
      type: "textarea",
      onConfirm: async (damageNotes: string) => {
        const response = await ownerConfirm(rentRequestId, damageNotes || undefined);
        if (response?.success) {
          toast.success(response.message || "Checkout confirmed successfully!");
          fetchOwnerRentRequests();
          await refreshCheckoutStatus(rentRequestId);
        } else {
          throw new Error("Failed to confirm checkout");
        }
      }
    });
  };

  // Handle owner checkout rejection
  const handleOwnerCheckoutReject = async (rentRequestId: number) => {
    openModal({
      title: "Report Damages",
      placeholder: "Please describe the damages found...",
      required: true,
      type: "textarea",
      onConfirm: async (damageNotes: string) => {
        const response = await ownerReject(rentRequestId, damageNotes);
        if (response?.success) {
          toast.success(response.message || "Checkout rejected and escalated to agent");
          fetchOwnerRentRequests();
          await refreshCheckoutStatus(rentRequestId);
        } else {
          throw new Error("Failed to reject checkout");
        }
      }
    });
  };

  // Render checkout actions for users (renters)
  const renderCheckoutActions = (req: RentRequest) => {
    const checkoutStatus = checkoutStatuses[req.id];
    const isLoadingStatus = loadingCheckoutStatuses[req.id];
    
    // Show loader while fetching checkout status
    if (isLoadingStatus) {
      return (
        <div className="checkout-actions">
          <Loader />
        </div>
      );
    }
    
    if (canUserAccessCheckoutAction(req, 'request_checkout', checkoutStatus)) {
      return (
        <button
          onClick={() => handleCheckoutRequest(req.id)}
          className="action-btn checkout-btn"
          disabled={checkoutLoading}
        >
          <i className="fas fa-sign-out-alt"></i> 
          {checkoutLoading ? "Processing..." : "Request Checkout"}
        </button>
      );
    }

    if (checkoutStatus && checkoutStatus.checkout) {
      const { checkout, message } = checkoutStatus;

      return (
        <div className="checkout-actions">
          <div className="checkout-status">
            <span className={`checkout-status-badge checkout-${checkout.status}`}>
              <i className="fas fa-info-circle"></i>
              {checkout.status === 'pending' ? 'Checkout Pending' : 
               checkout.status === 'confirmed' ? 'Checkout Confirmed' :
               checkout.status === 'auto_confirmed' ? 'Auto Confirmed' : 
               'Checkout ' + checkout.status}
            </span>
            {message && <small className="checkout-message">{message}</small>}
          </div>
        </div>
      );
    }

    return null;
  };

  // Render checkout actions for owners - with proper access control and loader
  const renderOwnerCheckoutActions = (req: RentRequest) => {
    const checkoutStatus = checkoutStatuses[req.id];
    const isLoadingStatus = loadingCheckoutStatuses[req.id];
    
    // Show loader while fetching checkout status
    if (isLoadingStatus) {
      return (
        <div className="checkout-actions">
          <Loader />
        </div>
      );
    }
    
    if (!checkoutStatus || !checkoutStatus.checkout) {
      return null;
    }

    const { checkout } = checkoutStatus;

    return (
      <div className="checkout-actions">
        <div className="checkout-info">
          <span className={`checkout-status-badge checkout-${checkout.status}`}>
            <i className="fas fa-info-circle"></i>
            Checkout {checkout.status}
          </span>
          
          {checkout.owner_confirmation && checkout.owner_confirmation !== 'not_required' && (
            <span className={`checkout-status-badge checkout-${checkout.owner_confirmation}`}>
              <i className="fas fa-user-check"></i>
              Owner: {checkout.owner_confirmation}
            </span>
          )}
        </div>
        
        {checkout.owner_confirmation === 'pending' && (
          <div className="checkout-buttons">
            <button
              onClick={() => handleOwnerCheckoutConfirm(req.id)}
              className="action-btn confirm-btn"
              disabled={checkoutLoading}
            >
              <i className="fas fa-check"></i> Confirm Checkout
            </button>
            
            <button
              onClick={() => handleOwnerCheckoutReject(req.id)}
              className="action-btn reject-btn"
              disabled={checkoutLoading}
            >
              <i className="fas fa-exclamation-triangle"></i> Report Damages
            </button>
          </div>
        )}
        
        {checkout.owner_confirmation === 'confirmed' && (
          <small className="checkout-message">
            <i className="fas fa-check-circle"></i> You have confirmed this checkout
          </small>
        )}
        
        {checkout.owner_confirmation === 'rejected' && (
          <small className="checkout-message">
            <i className="fas fa-exclamation-circle"></i> You reported damages - escalated to agent
          </small>
        )}
        
        {checkout.owner_confirmation === 'auto_confirmed' && (
          <small className="checkout-message">
            <i className="fas fa-clock"></i> Auto-confirmed after 72h inactivity
          </small>
        )}
        
        {checkout.owner_confirmation === 'not_required' && (
          <small className="checkout-message">
            <i className="fas fa-info-circle"></i> Owner confirmation not required for this checkout type
          </small>
        )}
      </div>
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
      case "paid":
        return (
          <div className="action-buttons">
            <span className="status-info">Rental Active</span>
            {renderOwnerCheckoutActions(req)}
          </div>
        );
      case "completed":
        return (
          <span className="status-badge status-completed">
            <i className="fas fa-check-double"></i> Completed
          </span>
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
                    fetchUserRentRequests();
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
          <div className="action-buttons">
            {renderCheckoutActions(req)}
          </div>
        );
      case "completed":
        return (
          <span className="status-badge status-completed">
            <i className="fas fa-check-double"></i> Completed
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
      <InputModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        placeholder={modalConfig.placeholder}
        required={modalConfig.required}
        type={modalConfig.type}
      />

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
                <div className="request-header-info">
                  <div className="request-id">
                    <i className="fas fa-hashtag"></i> Request #{req.id}
                  </div>
                  {getStatusBadge(req.status)}
                </div>

                <div className="request-content">
                  <div className="request-info">
                    <h4 className="property-title"
                        onClick={() => navigate(`/property/${req.property?.id}`)}
                    >
                      {req.property?.title || "Property Title"}
                    </h4>
                    
                    <div className="location">
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      {req.property?.location?.address || "Property Location"}
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

                    <div className="dates">
                      <i className="fas fa-calendar-check"></i>{" "}
                      Check-in: {new Date(req.check_in).toLocaleDateString()} | 
                      <i className="fas fa-calendar-times"></i>{" "}
                      Check-out: {new Date(req.check_out).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="request-actions">
                  {renderOwnerActions(req)}
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
                <div className="request-header-info">
                  <div className="request-id">
                    <i className="fas fa-hashtag"></i> Request #{req.id}
                  </div>
                  {getStatusBadge(req.status)}
                </div>

                <div className="request-content">
                  <div className="request-info">
                    <h4 className="property-title">
                      {req.property?.title || "Property Title"}
                    </h4>

                    <div className="location">
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      {req.property?.location?.address || "Property Location"}
                    </div>

                    <div className="dates">
                      <i className="fas fa-calendar-check"></i>{" "}
                      Check-in: {new Date(req.check_in).toLocaleDateString()} | 
                      <i className="fas fa-calendar-times"></i>{" "}
                      Check-out: {new Date(req.check_out).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="request-actions">
                  {renderUserActions(req)}
                </div>
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
      
      {userRentRequests.length === 0 && ownerRentRequests.length === 0 && (
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