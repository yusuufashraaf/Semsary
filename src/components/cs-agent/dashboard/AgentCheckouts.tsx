import React, { useEffect, useState } from "react";
import { useCheckouts } from "@hooks/useCheckout";
import { Checkout } from "src/types";
import { toast } from "react-toastify";
import styles from "./AgentCheckouts.module.css";
import { formatCurrency } from "@utils/HelperFunctions";
import Loader from "@components/common/Loader/Loader";

// Extended types for runtime data structure
interface UserInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  status: string;
  id_state: string;
  id_image_url?: string | null;
  email_verified_at?: string | null;
  phone_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface PropertyWithOwner {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  type: string;
  price: string;
  price_type: string;
  location: {
    address: string;
    lat?: string;
    lng?: string;
  };
  size: number;
  bedrooms: number;
  bathrooms: number;
  property_state: string;
  status: string;
  is_in_wishlist: boolean;
  created_at: string;
  updated_at: string;
  owner?: UserInfo;
}

interface RentRequestExtended {
  id: number;
  property_id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  status: string;
  payment_deadline?: string;
  created_at: string;
  updated_at: string;
  property?: PropertyWithOwner;
  user?: UserInfo;
}

type AgentCheckoutsProps = {
  userId: number;
};

/* ---------------- Decision Modal ---------------- */
const DecisionModal = ({
  isOpen,
  onClose,
  onConfirm,
  checkout,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (depositPercent: number, rentReturned: boolean, notes: string) => void;
  checkout: Checkout | null;
}) => {
  const [depositPercent, setDepositPercent] = useState(100);
  const [rentReturned, setRentReturned] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (checkout && isOpen) {
      setDepositPercent(Number(checkout.deposit_return_percent ?? 100));
      setRentReturned(checkout.agent_decision?.rent_returned ?? false);
      setNotes(checkout.agent_notes ?? "");
    }
  }, [checkout, isOpen]);

  const handleSubmit = async () => {
    if (depositPercent < 0 || depositPercent > 100) {
      toast.warning("Deposit return percentage must be between 0 and 100");
      return;
    }
    if (!notes.trim()) {
      toast.warning("Please provide decision notes");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(depositPercent, rentReturned, notes);
      setDepositPercent(100);
      setRentReturned(false);
      setNotes("");
      onClose();
    } catch {
      // handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !checkout) return null;

  // Type assertion to access extended properties
  const rentRequest = checkout.rentRequest as RentRequestExtended | undefined;
  const property = rentRequest?.property;
  const owner = property?.owner;
  const renter = rentRequest?.user;

  return (
    <div className="input-modal-overlay" onClick={!isSubmitting ? onClose : undefined}>
      <div
        className="input-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}
      >
        {/* HEADER */}
        <div className="input-modal-header">
          <h3 className="input-modal-title">
            <i className="fas fa-gavel"></i> Agent Decision
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
            className="input-modal-close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="input-modal-body">
          {/* Checkout Summary */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#333', marginBottom: '12px', borderBottom: '2px solid #e0e0e0', paddingBottom: '8px' }}>
              <i className="fas fa-clipboard-check"></i> Checkout Summary
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <p><strong>Checkout ID:</strong> #{checkout.id}</p>
              <p><strong>Request ID:</strong> #{checkout.rent_request_id}</p>
              <p><strong>Transaction Ref:</strong> {checkout.transaction_ref}</p>
              <p><strong>Type:</strong> {checkout.type}</p>
              <p><strong>Status:</strong> 
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '4px', 
                  marginLeft: '8px',
                  backgroundColor: checkout.status === 'completed' ? '#d4edda' : '#fff3cd',
                  color: checkout.status === 'completed' ? '#155724' : '#856404'
                }}>
                  {checkout.status}
                </span>
              </p>
              <p><strong>Reason:</strong> {checkout.reason || "—"}</p>
              <p><strong>Owner Confirmation:</strong> {checkout.owner_confirmation}</p>
              <p><strong>Requested At:</strong> {new Date(checkout.requested_at).toLocaleString()}</p>
              {checkout.processed_at && (
                <p><strong>Processed At:</strong> {new Date(checkout.processed_at).toLocaleString()}</p>
              )}
            </div>
            {checkout.owner_notes && (
              <p style={{ marginTop: '12px' }}><strong>Owner Notes:</strong> <em>"{checkout.owner_notes}"</em></p>
            )}
          </div>

          {/* Rent Request Details */}
          {rentRequest && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: '#333', marginBottom: '12px', borderBottom: '2px solid #e0e0e0', paddingBottom: '8px' }}>
                <i className="fas fa-calendar-alt"></i> Rent Request Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <p><strong>Check-in:</strong> {new Date(rentRequest.check_in).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(rentRequest.check_out).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {rentRequest.status}</p>
                <p><strong>Created:</strong> {new Date(rentRequest.created_at).toLocaleDateString()}</p>
                {rentRequest.payment_deadline && (
                  <p><strong>Payment Deadline:</strong> {new Date(rentRequest.payment_deadline).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          )}

          {/* Property Info */}
          {property && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: '#333', marginBottom: '12px', borderBottom: '2px solid #e0e0e0', paddingBottom: '8px' }}>
                <i className="fas fa-home"></i> Property Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <p><strong>Title:</strong> {property.title}</p>
                <p><strong>Type:</strong> {property.type}</p>
                <p><strong>Price:</strong> {formatCurrency(property.price)} / {formatCurrency(property.price_type)}</p>
                <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
                <p><strong>Size:</strong> {property.size} sqm</p>
                <p><strong>Status:</strong> {property.status}</p>
                <p><strong>Property State:</strong> {property.property_state}</p>
              </div>
              {property.location && (
                <div style={{ marginTop: '12px' }}>
                  <p><strong>Address:</strong> {property.location.address}</p>
                  {property.location.lat && property.location.lng && (
                    <p><strong>Coordinates:</strong> {property.location.lat}, {property.location.lng}</p>
                  )}
                </div>
              )}
              {property.description && (
                <div style={{ marginTop: '12px' }}>
                  <p><strong>Description:</strong></p>
                  <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', maxHeight: '100px', overflow: 'auto' }}>
                    {property.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Owner Info */}
          {owner && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: '#333', marginBottom: '12px', borderBottom: '2px solid #e0e0e0', paddingBottom: '8px' }}>
                <i className="fas fa-user-tie"></i> Property Owner Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <p><strong>Name:</strong> {owner.first_name} {owner.last_name}</p>
                <p><strong>Email:</strong> {owner.email}</p>
                <p><strong>Phone:</strong> {owner.phone_number}</p>
                <p><strong>Role:</strong> {owner.role}</p>
                <p><strong>Status:</strong> {owner.status}</p>
                <p><strong>ID State:</strong> {owner.id_state}</p>
                <p><strong>Joined:</strong> {new Date(owner.created_at).toLocaleDateString()}</p>
                <p><strong>Email Verified:</strong> {owner.email_verified_at ? 'Yes' : 'No'}</p>
                <p><strong>Phone Verified:</strong> {owner.phone_verified_at ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}

          {/* Renter Info */}
          {renter && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: '#333', marginBottom: '12px', borderBottom: '2px solid #e0e0e0', paddingBottom: '8px' }}>
                <i className="fas fa-user"></i> Renter Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <p><strong>Name:</strong> {renter.first_name} {renter.last_name}</p>
                <p><strong>Email:</strong> {renter.email}</p>
                <p><strong>Phone:</strong> {renter.phone_number}</p>
                <p><strong>Role:</strong> {renter.role}</p>
                <p><strong>Status:</strong> {renter.status}</p>
                <p><strong>ID State:</strong> {renter.id_state}</p>
                <p><strong>Joined:</strong> {new Date(renter.created_at).toLocaleDateString()}</p>
                <p><strong>Email Verified:</strong> {renter.email_verified_at ? 'Yes' : 'No'}</p>
                <p><strong>Phone Verified:</strong> {renter.phone_verified_at ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}

          {/* Financials */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#333', marginBottom: '12px', borderBottom: '2px solid #e0e0e0', paddingBottom: '8px' }}>
              <i className="fas fa-dollar-sign"></i> Financial Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <p><strong>Current Deposit Return %:</strong> {checkout.deposit_return_percent}%</p>
              <p><strong>Final Refund Amount:</strong> {formatCurrency(Number(checkout.final_refund_amount))}</p>
              <p><strong>Final Payout Amount:</strong> {formatCurrency(Number(checkout.final_payout_amount))}</p>
              {checkout.refund_purchase_id && (
                <p><strong>Refund Purchase ID:</strong> {checkout.refund_purchase_id}</p>
              )}
              {checkout.payout_purchase_id && (
                <p><strong>Payout Purchase ID:</strong> {checkout.payout_purchase_id}</p>
              )}
            </div>
          </div>

          {/* Previous Agent Decision */}
          {checkout.agent_decision && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: '#333', marginBottom: '12px', borderBottom: '2px solid #e0e0e0', paddingBottom: '8px' }}>
                <i className="fas fa-gavel"></i> Previous Agent Decision
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <p><strong>Decided By:</strong> {checkout.agent_decision.decided_by}</p>
                <p><strong>Decided At:</strong> {new Date(checkout.agent_decision.decided_at).toLocaleString()}</p>
                <p><strong>Deposit Return %:</strong> {checkout.agent_decision.deposit_return_percent}%</p>
                <p><strong>Rent Returned:</strong> {checkout.agent_decision.rent_returned ? 'Yes' : 'No'}</p>
              </div>
              <p><strong>Notes:</strong> <em>"{checkout.agent_decision.notes}"</em></p>
            </div>
          )}

          {/* Decision Inputs */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: '#333', marginBottom: '12px', borderBottom: '2px solid #e0e0e0', paddingBottom: '8px' }}>
              <i className="fas fa-edit"></i> Make New Decision
            </h4>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                  Deposit Return Percentage (0-100):
                </label>
                <input
                  type="number"
                  className="input-modal-input"
                  value={depositPercent}
                  onChange={(e) => setDepositPercent(Number(e.target.value))}
                  min={0}
                  max={100}
                  disabled={isSubmitting}
                  placeholder="Deposit %"
                  style={{ width: '200px' }}
                />
              </div>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={rentReturned}
                  onChange={(e) => setRentReturned(e.target.checked)}
                  disabled={isSubmitting}
                />
                <strong>Rent Returned</strong>
              </label>
              
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                  Decision Notes (Required):
                </label>
                <textarea
                  className="input-modal-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  disabled={isSubmitting}
                  placeholder="Enter your decision notes here..."
                  style={{ width: '100%', minHeight: '80px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="input-modal-footer">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
            className="input-modal-btn input-modal-btn-secondary"
          >
            <i className="fas fa-times"></i> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !notes.trim()}
            type="button"
            className="input-modal-btn input-modal-btn-primary"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Processing...
              </>
            ) : (
              <>
                <i className="fas fa-check"></i> Confirm Decision
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Main Agent Checkouts ---------------- */
const AgentCheckouts: React.FC<AgentCheckoutsProps> = ({ userId }) => {
  const [selectedCheckout, setSelectedCheckout] = useState<Checkout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    adminCheckouts,
    loading,
    error,
    fetchAdminCheckouts,
    makeAgentDecision,
    clearError,
  } = useCheckouts(userId);

  useEffect(() => {
    fetchAdminCheckouts();
  }, [fetchAdminCheckouts]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const openDecisionModal = (checkout: Checkout) => {
    setSelectedCheckout(checkout);
    setIsModalOpen(true);
  };

  const closeDecisionModal = () => {
    setIsModalOpen(false);
    setSelectedCheckout(null);
  };

  const handleAgentDecision = async (
    depositPercent: number,
    rentReturned: boolean,
    notes: string
  ) => {
    if (!selectedCheckout) return;

    const response = await makeAgentDecision(selectedCheckout.id, {
      deposit_return_percent: depositPercent,
      rent_returned: rentReturned,
      notes,
    });

    if (response?.success) {
      toast.success(response.message || "Decision submitted successfully!");
      fetchAdminCheckouts();
    } else {
      throw new Error("Failed to submit decision");
    }
  };

  const canMakeDecision = (checkout: Checkout) =>
    checkout.status === "pending" &&
    (checkout.owner_confirmation === "not_required" ||
      checkout.owner_confirmation === "rejected");

  if (loading) {
    return (
      <div className={styles["loading"]}>
        <div className=" text-primary" role="status"></div>
        <Loader message="Loading checkouts..." />
      </div>
    );
  }

  return (
    <div className={styles["agent-checkouts-container"]}>
      <DecisionModal
        isOpen={isModalOpen}
        onClose={closeDecisionModal}
        onConfirm={handleAgentDecision}
        checkout={selectedCheckout}
      />

      <div className={styles["page-header"]}>
        <h1 className={styles["page-title"]}>
          <i className="fas fa-gavel"></i> Agent Checkout Decisions
        </h1>
        <span className={styles["checkout-count"]}>
          {adminCheckouts.length} total checkouts
        </span>
      </div>

      {adminCheckouts.length > 0 ? (
        <div className={styles["checkouts-list"]}>
          {adminCheckouts.map((checkout) => {
            // Type assertion for extended properties
            const rentRequest = checkout.rentRequest as RentRequestExtended | undefined;
            const property = rentRequest?.property;
            const owner = property?.owner;
            const renter = rentRequest?.user;
            
            return (
              <div
                key={checkout.id}
                className={`${styles["checkout-card"]} ${
                  canMakeDecision(checkout) ? styles["actionable"] : ""
                }`}
                style={{ marginBottom: '20px' }}
              >
                <div className={styles["checkout-header"]}>
                  <div>
                    <span>#{checkout.id}</span> | Request #{checkout.rent_request_id}
                    {checkout.transaction_ref && (
                      <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                        Ref: {checkout.transaction_ref.substring(0, 8)}...
                      </span>
                    )}
                  </div>
                  <span className={styles.badge}>{checkout.status}</span>
                </div>

                <div className={styles["checkout-body"]}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <p><strong>Type:</strong> {checkout.type}</p>
                    <p><strong>Owner Confirmation:</strong> {checkout.owner_confirmation}</p>
                    <p><strong>Refund:</strong> {formatCurrency(Number(checkout.final_refund_amount))}</p>
                    <p><strong>Payout:</strong> {formatCurrency(Number(checkout.final_payout_amount))}</p>
                  </div>
                  
                  {property && (
                    <div style={{ marginBottom: '12px' }}>
                      <p><strong>Property:</strong> {property.title} ({property.type})</p>
                      <p><strong>Address:</strong> {property.location?.address}</p>
                      <p><strong>Price:</strong> {formatCurrency(property.price)} / {formatCurrency(property.price_type)}</p>
                    </div>
                  )}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {owner && (
                      <>
                        <p><strong>Owner:</strong> {owner.first_name} {owner.last_name}</p>
                        <p><strong>Owner Phone:</strong> {owner.phone_number}</p>
                      </>
                    )}
                    {renter && (
                      <>
                        <p><strong>Renter:</strong> {renter.first_name} {renter.last_name}</p>
                        <p><strong>Renter Phone:</strong> {renter.phone_number}</p>
                      </>
                    )}
                  </div>
                  
                  {checkout.reason && (
                    <p style={{ marginTop: '8px' }}><strong>Reason:</strong> <em>"{checkout.reason}"</em></p>
                  )}
                  
                  {checkout.owner_notes && (
                    <p style={{ marginTop: '8px' }}><strong>Owner Notes:</strong> <em>"{checkout.owner_notes}"</em></p>
                  )}
                </div>

                {canMakeDecision(checkout) && (
                  <div className={styles["checkout-footer"]}>
                    <button
                      className={styles["btn-make-decision"]}
                      onClick={() => openDecisionModal(checkout)}
                    >
                      <i className="fas fa-gavel"></i> Make Decision
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles["no-checkouts"]}>
          <i className="fas fa-clipboard-check"></i>
          <h3>No Checkouts Found</h3>
        </div>
      )}
    </div>
  );
};

export default AgentCheckouts;