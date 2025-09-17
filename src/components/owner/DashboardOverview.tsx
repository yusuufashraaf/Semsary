import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { getDashboardData, getProperties } from "../../store/Owner/ownerDashboardSlice";
import { RootState, AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";

const DashboardOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { overview, loading, properties } = useSelector(
    (state: RootState) => state.ownerDashboard
  );

  useEffect(() => {
    dispatch(getDashboardData());
    dispatch(getProperties());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Empty State Component
  const EmptyPropertiesState = () => (
    <div className="text-center py-5">
      <div className="mb-4">
        <i className="fas fa-home" style={{fontSize: '64px', color: '#e0bcbc', opacity: 0.7}}></i>
      </div>
      <h4 className="mb-3" style={{color: '#666'}}>No Properties Yet</h4>
      <p className="text-muted mb-4" style={{maxWidth: '400px', margin: '0 auto'}}>
        You haven't added any properties to your portfolio yet. 
        Start by adding your first property to begin managing your real estate listings.
      </p>
      <div className="d-flex gap-2 justify-content-center">
        <Button 
          variant="primary"
          onClick={() => navigate('/owner-dashboard/add-property')}
          style={{backgroundColor: '#e0bcbc', borderColor: '#e0bcbc', color: '#333'}}
          className="px-4"
        >
          <i className="fas fa-plus me-2"></i>
          Add Your First Property
        </Button>
        <Button 
          variant="outline-secondary"
          onClick={() => navigate('/owner-dashboard/manage-properties')}
        >
          View Guide
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Cards */}
      <Row>
        <Col md={4}>
          <Card className="mb-3 shadow-sm" style={{ backgroundColor: "#F2E8E8" }}>
            <Card.Body>
              <Card.Title>Total Properties</Card.Title>
              <Card.Text className="h4 mb-0">{overview?.total_properties || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 shadow-sm" style={{ backgroundColor: "#F2E8E8" }}>
            <Card.Body>
              <Card.Title>Total Bookings</Card.Title>
              <Card.Text className="h4 mb-0">{overview?.total_bookings || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 shadow-sm" style={{ backgroundColor: "#F2E8E8" }}>
            <Card.Body>
              <Card.Title>Total Income</Card.Title>
              <Card.Text className="h4 mb-0">${overview?.total_income || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Properties Section */}
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="section-title mb-0">All Properties</h5>
        </div>

        {properties.length === 0 ? (
          <Card>
            <Card.Body>
              <EmptyPropertiesState />
            </Card.Body>
          </Card>
        ) : (
          <div className="table-container">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Property</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {properties.slice(0, 5).map((property) => (
                  <tr key={property.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {property.images?.[0]?.image_url && (
                          <img 
                            src={property.images[0].image_url} 
                            alt={property.title}
                            className="me-2 rounded"
                            style={{width: '40px', height: '40px', objectFit: 'cover'}}
                          />
                        )}
                        <div>
                          <strong>{property.title}</strong>
                          <br />
                          <small className="text-muted">{property.type}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        property.property_state === 'Valid' ? 'bg-success' :
                        property.property_state === 'Rented' ? 'bg-info' :
                        property.property_state === 'Pending' ? 'bg-warning' : 'bg-secondary'
                      }`}>
                        {property.property_state}
                      </span>
                    </td>
                    <td>{property.location?.address || 'N/A'}</td>
                    <td>
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => navigate(`/property/${property.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {properties.length > 5 && (
              <div className="text-center mt-3">
                <Button 
                  variant="outline-secondary"
                  onClick={() => navigate('/manage-properties')}
                >
                  View All Properties ({properties.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default DashboardOverview;