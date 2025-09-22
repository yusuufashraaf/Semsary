import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Button } from "react-bootstrap";
import { getDashboardData, getProperties } from "../../store/Owner/ownerDashboardSlice";
import { RootState, AppDispatch } from "../../store";
import UserProperties from "@components/Profile/UserProperties";
import { useAppSelector } from '@store/hook';
import { useNavigate } from "react-router-dom";
import './DashboardOverview.css';
import { Building, Calendar, DollarSign, Home, Eye } from 'lucide-react';
import Loader from "@components/common/Loader/Loader";

const DashboardOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { overview, loading, properties } = useSelector(
    (state: RootState) => state.ownerDashboard
  );
  const { user } = useAppSelector(state => state.Authslice);  
  useEffect(() => {
    dispatch(getDashboardData());
    dispatch(getProperties());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
<Loader />
      </div>
    );
  }

  // Empty State Component
  const EmptyPropertiesState = () => (
    <div className="text-center py-4">
      <div className="mb-3">
        <Home className="empty-icon" size={40} />
      </div>
      <h6 className="mb-2 empty-title">No Properties Yet</h6>
      <p className="text-muted mb-0 empty-text">
        Start by adding your first property to begin managing your listings.
      </p>
    </div>
  );

  return (
    <>
      {/* Compact Stats Cards with Professional Icons */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">
                  <Building size={18} strokeWidth={2} />
                </div>
                <div>
                  <div className="stat-label">Properties</div>
                  <div className="stat-value">{overview?.total_properties || 0}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">
                  <Calendar size={18} strokeWidth={2} />
                </div>
                <div>
                  <div className="stat-label">Bookings</div>
                  <div className="stat-value">{overview?.total_bookings || 0}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div className="stat-icon me-3">
                  <DollarSign size={18} strokeWidth={2} />
                </div>
                <div>
                  <div className="stat-label">Income</div>
                  <div className="stat-value">${overview?.total_income || 0}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Properties Section */}
      <div className="properties-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {properties.length > 0 && (
            <Button 
              size="sm"
              variant="outline-secondary"
              onClick={() => navigate('/owner-dashboard/manage-properties')}
              className="view-all-btn"
            >
              View All ({properties.length})
            </Button>
          )}
        </div>

        {/* {properties.length === 0 ? (
          <Card className="empty-state-card">
            <Card.Body>
              <EmptyPropertiesState />
            </Card.Body>
          </Card>
        ) : (
          <Card className="properties-table-card">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table table-sm table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 py-2 ps-3">Property</th>
                      <th className="border-0 py-2">Status</th>
                      <th className="border-0 py-2">Location</th>
                      <th className="border-0 py-2 pe-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.slice(0, 5).map((property) => (
                      <tr key={property.id}>
                        <td className="ps-3 py-2">
                          <div className="d-flex align-items-center">
                            {property.images?.[0]?.image_url && (
                              <img 
                                src={property.images[0].image_url} 
                                alt={property.title}
                                className="property-thumb me-2"
                              />
                            )}
                            <div>
                              <div className="property-title">{property.title}</div>
                              <small className="text-muted property-type">{property.type}</small>
                            </div>
                          </div>
                        </td>
                        <td className="py-2">
                          <span className={`status-badge ${
                            property.property_state === 'Valid' ? 'status-valid' :
                            property.property_state === 'Rented' ? 'status-rented' :
                            property.property_state === 'Pending' ? 'status-pending' : 'status-inactive'
                          }`}>
                            {property.property_state}
                          </span>
                        </td>
                        <td className="py-2">
                          <div className="location-text">
                            {property.location?.address?.slice(0, 30)}...
                          </div>
                        </td>
                        <td className="py-2 pe-3">
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            className="view-btn"
                            onClick={() => navigate(`/property/${property.id}`)}
                          >
                            <Eye size={12} className="me-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        )} */}
        {user && <UserProperties user={user} />}
      </div>
    </>
  );
};

export default DashboardOverview;