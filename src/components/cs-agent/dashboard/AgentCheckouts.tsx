import React, { useEffect, useState } from "react";
import { useCheckouts } from "@hooks/useCheckout";
import { Checkout } from "src/types";
import { toast } from "react-toastify";
import styles from "./AgentCheckouts.module.css";
import { formatCurrency } from "@utils/HelperFunctions";
import Loader from "@components/common/Loader/Loader";
import { RentRequestExtended, AgentCheckoutsProps } from "../../../types/index";

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
  const [activeTab, setActiveTab] = useState<'summary' | 'property' | 'parties' | 'financial'>('summary');

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

  // ✅ FIXED: Use snake_case rent_request instead of camelCase rentRequest
  const rentRequest = checkout.rent_request as RentRequestExtended | undefined;
  const property = rentRequest?.property;
  const owner = property?.owner;
  const renter = rentRequest?.user;

  const StatusBadge = ({ status }: { status: string }) => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#fff3cd', text: '#856404' },
      confirmed: { bg: '#d4edda', text: '#155724' },
      completed: { bg: '#d1ecf1', text: '#0c5460' },
      rejected: { bg: '#f8d7da', text: '#721c24' },
    };
    const colors = statusColors[status] || { bg: '#e2e3e5', text: '#383d41' };
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: colors.bg,
        color: colors.text,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {status}
      </span>
    );
  };

  const InfoCard = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
    <div style={{
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      border: '1px solid #e9ecef',
      transition: 'all 0.2s',
    }}>
      <h4 style={{
        color: '#495057',
        marginBottom: '12px',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <i className={icon} style={{ color: '#6c757d' }}></i>
        {title}
      </h4>
      {children}
    </div>
  );

  return (
    <div 
      className="input-modal-overlay" 
      onClick={!isSubmitting ? onClose : undefined}
      style={{
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .tab-button {
            padding: 10px 16px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-weight: 500;
            color: #6c757d;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
            font-size: 14px;
          }
          .tab-button:hover {
            color: #495057;
            background: #f8f9fa;
          }
          .tab-button.active {
            color: #007bff;
            border-bottom-color: #007bff;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
          }
          .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .info-label {
            font-size: 12px;
            color: #6c757d;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .info-value {
            font-size: 14px;
            color: #212529;
            font-weight: 500;
          }
        `}
      </style>
      <div
        className="input-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* HEADER */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
              <i className="fas fa-gavel" style={{ marginRight: '10px' }}></i>
              Agent Decision - Checkout #{checkout.id}
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
              Request #{checkout.rent_request_id} • {checkout.type.replace(/_/g, ' ')}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: 'white',
              fontSize: '18px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* TABS */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e9ecef',
          padding: '0 24px',
          gap: '4px',
          backgroundColor: '#fff'
        }}>
          <button
            className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <i className="fas fa-clipboard-check"></i> Summary
          </button>
          <button
            className={`tab-button ${activeTab === 'property' ? 'active' : ''}`}
            onClick={() => setActiveTab('property')}
          >
            <i className="fas fa-home"></i> Property
          </button>
          <button
            className={`tab-button ${activeTab === 'parties' ? 'active' : ''}`}
            onClick={() => setActiveTab('parties')}
          >
            <i className="fas fa-users"></i> Parties
          </button>
          <button
            className={`tab-button ${activeTab === 'financial' ? 'active' : ''}`}
            onClick={() => setActiveTab('financial')}
          >
            <i className="fas fa-dollar-sign"></i> Financial
          </button>
        </div>

        {/* BODY */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {/* SUMMARY TAB */}
          {activeTab === 'summary' && (
            <>
              <InfoCard icon="fas fa-info-circle" title="Checkout Information">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <StatusBadge status={checkout.status} />
                  </div>
                  <div className="info-item">
                    <span className="info-label">Owner Confirmation</span>
                    <StatusBadge status={checkout.owner_confirmation} />
                  </div>
                  <div className="info-item">
                    <span className="info-label">Transaction Ref</span>
                    <span className="info-value">{checkout.transaction_ref || '—'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Requested At</span>
                    <span className="info-value">{new Date(checkout.requested_at).toLocaleString()}</span>
                  </div>
                </div>
                {checkout.reason && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#fff3cd', borderRadius: '6px' }}>
                    <strong style={{ fontSize: '12px', color: '#856404' }}>Reason:</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#856404' }}>"{checkout.reason}"</p>
                  </div>
                )}
                {checkout.owner_notes && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#f8d7da', borderRadius: '6px' }}>
                    <strong style={{ fontSize: '12px', color: '#721c24' }}>Owner Notes:</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#721c24' }}>"{checkout.owner_notes}"</p>
                  </div>
                )}
              </InfoCard>

              {rentRequest && (
                <InfoCard icon="fas fa-calendar-alt" title="Rent Request Details">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Check-in</span>
                      <span className="info-value">{new Date(rentRequest.check_in).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Check-out</span>
                      <span className="info-value">{new Date(rentRequest.check_out).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Status</span>
                      <StatusBadge status={rentRequest.status} />
                    </div>
                    <div className="info-item">
                      <span className="info-label">Created</span>
                      <span className="info-value">{new Date(rentRequest.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </InfoCard>
              )}
            </>
          )}

          {/* PROPERTY TAB */}
          {activeTab === 'property' && property && (
            <>
              <InfoCard icon="fas fa-home" title="Property Details">
                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#212529' }}>{property.title}</h5>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <StatusBadge status={property.type} />
                    <StatusBadge status={property.status} />
                    <StatusBadge status={property.property_state} />
                  </div>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Price</span>
                    <span className="info-value">{formatCurrency(property.price)} / {property.price_type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Size</span>
                    <span className="info-value">{property.size} sqm</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Bedrooms</span>
                    <span className="info-value">{property.bedrooms}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Bathrooms</span>
                    <span className="info-value">{property.bathrooms}</span>
                  </div>
                </div>
              </InfoCard>

              {property.location && (
                <InfoCard icon="fas fa-map-marker-alt" title="Location">
                  <div className="info-item">
                    <span className="info-label">Address</span>
                    <span className="info-value">{property.location.address}</span>
                  </div>
                  {property.location.lat && property.location.lng && (
                    <div className="info-item" style={{ marginTop: '8px' }}>
                      <span className="info-label">Coordinates</span>
                      <span className="info-value">{property.location.lat}, {property.location.lng}</span>
                    </div>
                  )}
                </InfoCard>
              )}

              {property.description && (
                <InfoCard icon="fas fa-align-left" title="Description">
                  <p style={{ margin: 0, fontSize: '14px', color: '#6c757d', lineHeight: '1.6', maxHeight: '150px', overflow: 'auto' }}>
                    {property.description}
                  </p>
                </InfoCard>
              )}
            </>
          )}

          {/* PARTIES TAB */}
          {activeTab === 'parties' && (
            <>
              {owner && (
                <InfoCard icon="fas fa-user-tie" title="Property Owner">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name</span>
                      <span className="info-value">{owner.first_name} {owner.last_name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{owner.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{owner.phone_number}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Role</span>
                      <StatusBadge status={owner.role} />
                    </div>
                    <div className="info-item">
                      <span className="info-label">Account Status</span>
                      <StatusBadge status={owner.status} />
                    </div>
                    <div className="info-item">
                      <span className="info-label">ID State</span>
                      <StatusBadge status={owner.id_state} />
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email Verified</span>
                      <span className="info-value">{owner.email_verified_at ? '✅ Yes' : '❌ No'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone Verified</span>
                      <span className="info-value">{owner.phone_verified_at ? '✅ Yes' : '❌ No'}</span>
                    </div>
                  </div>
                </InfoCard>
              )}

              {renter && (
                <InfoCard icon="fas fa-user" title="Renter">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Name</span>
                      <span className="info-value">{renter.first_name} {renter.last_name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{renter.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{renter.phone_number}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Role</span>
                      <StatusBadge status={renter.role} />
                    </div>
                    <div className="info-item">
                      <span className="info-label">Account Status</span>
                      <StatusBadge status={renter.status} />
                    </div>
                    <div className="info-item">
                      <span className="info-label">ID State</span>
                      <StatusBadge status={renter.id_state} />
                    </div>
                    <div className="info-item">
                      <span className="info-label">Email Verified</span>
                      <span className="info-value">{renter.email_verified_at ? '✅ Yes' : '❌ No'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Phone Verified</span>
                      <span className="info-value">{renter.phone_verified_at ? '✅ Yes' : '❌ No'}</span>
                    </div>
                  </div>
                </InfoCard>
              )}
            </>
          )}

          {/* FINANCIAL TAB */}
          {activeTab === 'financial' && (
            <>
              <InfoCard icon="fas fa-dollar-sign" title="Current Financial Status">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Deposit Return %</span>
                    <span className="info-value">{checkout.deposit_return_percent || 0}%</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Final Refund</span>
                    <span className="info-value" style={{ color: '#28a745' }}>
                      {formatCurrency(Number(checkout.final_refund_amount || 0))}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Final Payout</span>
                    <span className="info-value" style={{ color: '#007bff' }}>
                      {formatCurrency(Number(checkout.final_payout_amount || 0))}
                    </span>
                  </div>
                  {checkout.refund_purchase_id && (
                    <div className="info-item">
                      <span className="info-label">Refund Purchase ID</span>
                      <span className="info-value">#{checkout.refund_purchase_id}</span>
                    </div>
                  )}
                  {checkout.payout_purchase_id && (
                    <div className="info-item">
                      <span className="info-label">Payout Purchase ID</span>
                      <span className="info-value">#{checkout.payout_purchase_id}</span>
                    </div>
                  )}
                </div>
              </InfoCard>

              {checkout.agent_decision && (
                <InfoCard icon="fas fa-history" title="Previous Agent Decision">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Decided By</span>
                      <span className="info-value">Agent #{checkout.agent_decision.decided_by}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Decided At</span>
                      <span className="info-value">{new Date(checkout.agent_decision.decided_at).toLocaleString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Deposit Return %</span>
                      <span className="info-value">{checkout.agent_decision.deposit_return_percent}%</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Rent Returned</span>
                      <span className="info-value">{checkout.agent_decision.rent_returned ? '✅ Yes' : '❌ No'}</span>
                    </div>
                  </div>
                  {checkout.agent_decision.notes && (
                    <div style={{ marginTop: '12px', padding: '12px', background: '#e7f3ff', borderRadius: '6px' }}>
                      <strong style={{ fontSize: '12px', color: '#004085' }}>Notes:</strong>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#004085' }}>"{checkout.agent_decision.notes}"</p>
                    </div>
                  )}
                </InfoCard>
              )}

              {/* DECISION FORM */}
              <InfoCard icon="fas fa-gavel" title="Make New Decision">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#495057' }}>
                      Deposit Return Percentage (0-100)
                    </label>
                    <input
                      type="number"
                      value={depositPercent}
                      onChange={(e) => setDepositPercent(Number(e.target.value))}
                      min={0}
                      max={100}
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid #ced4da',
                        fontSize: '14px',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                  
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#e9ecef'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  >
                    <input
                      type="checkbox"
                      checked={rentReturned}
                      onChange={(e) => setRentReturned(e.target.checked)}
                      disabled={isSubmitting}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <strong style={{ fontSize: '14px', color: '#495057' }}>Rent Returned to Renter</strong>
                  </label>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#495057' }}>
                      Decision Notes <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      disabled={isSubmitting}
                      placeholder="Provide detailed notes for your decision..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: '1px solid #ced4da',
                        fontSize: '14px',
                        resize: 'vertical',
                        minHeight: '100px',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                </div>
              </InfoCard>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          background: '#f8f9fa'
        }}>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
            style={{
              padding: '10px 24px',
              borderRadius: '6px',
              border: '1px solid #6c757d',
              background: 'white',
              color: '#6c757d',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#6c757d';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#6c757d';
            }}
          >
            <i className="fas fa-times"></i> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !notes.trim()}
            type="button"
            style={{
              padding: '10px 24px',
              borderRadius: '6px',
              border: 'none',
              background: isSubmitting || !notes.trim() ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isSubmitting || !notes.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isSubmitting || !notes.trim() ? 0.6 : 1
            }}
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
            // ✅ FIXED: Use snake_case rent_request instead of camelCase rentRequest
            const rentRequest = checkout.rent_request as RentRequestExtended | undefined;
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
                      <p><strong>Price:</strong> {formatCurrency(property.price)} / {property.price_type}</p>
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