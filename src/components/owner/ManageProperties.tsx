import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProperties, removeProperty } from "../../store/Owner/ownerDashboardSlice";
import { RootState, AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import { Card, Button, Spinner, Badge, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

const ManageProperties: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { properties, loading } = useSelector(
    (state: RootState) => state.ownerDashboard
  );
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [propertyToDelete, setPropertyToDelete] = React.useState<number | null>(null);

  useEffect(() => {
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
        <i className="fas fa-building" style={{fontSize: '64px', color: '#e0bcbc', opacity: 0.7}}></i>
      </div>
      <h4 className="mb-3" style={{color: '#666'}}>No Properties to Manage</h4>
      <p className="text-muted mb-4" style={{maxWidth: '500px', margin: '0 auto'}}>
        Your property portfolio is empty. Add your first property to start managing 
        your real estate listings, track bookings, and monitor your income.
      </p>
      <div className="d-flex gap-2 justify-content-center flex-wrap">
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
          onClick={() => navigate('/owner-dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );

  const activeListings = properties.filter(
    (p) => p.property_state === "Valid" || p.property_state === "Rented"
  );
  const inactiveListings = properties.filter(
    (p) => p.property_state === "Invalid" || p.property_state === "Pending" || p.property_state === "Sold"
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Valid: { variant: 'success', icon: 'fas fa-check-circle' },
      Rented: { variant: 'info', icon: 'fas fa-home' },
      Pending: { variant: 'warning', icon: 'fas fa-clock' },
      Invalid: { variant: 'danger', icon: 'fas fa-exclamation-triangle' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', icon: 'fas fa-question' };
    
    return (
      <Badge bg={config.variant} className="d-flex align-items-center gap-1">
        <i className={config.icon} style={{fontSize: '12px'}}></i>
        {status}
      </Badge>
    );
  };

  // Handle Edit
  const handleEdit = (id: number) => {
    navigate(`/property/${id}/edit`);
  };

  // Handle Delete
  const handleDeleteClick = (id: number) => {
    setPropertyToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      try {
        await dispatch(removeProperty(propertyToDelete)).unwrap();
        toast.success("Property deleted successfully");
        setShowDeleteModal(false);
        setPropertyToDelete(null);
      } catch (error) {
        toast.error("Failed to delete property");
      }
    }
  };

  const renderPropertyTable = (properties: any[], title: string) => {
    if (properties.length === 0) {
      return (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="card-title">{title}</h5>
            <div className="text-center py-3 text-muted">
              <i className="fas fa-inbox" style={{fontSize: '32px', opacity: 0.5}}></i>
              <p className="mt-2 mb-0">No {title.toLowerCase()} found</p>
            </div>
          </Card.Body>
        </Card>
      );
    }

    return (
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">{title}</h5>
            <Badge bg="light" text="dark">{properties.length}</Badge>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Property</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {property.images?.[0]?.image_url && (
                          <img 
                            src={property.images[0].image_url} 
                            alt={property.title}
                            className="me-3 rounded"
                            style={{width: '50px', height: '50px', objectFit: 'cover'}}
                          />
                        )}
                        <div>
                          <strong>{property.title}</strong>
                          <br />
                          <small className="text-muted">
                            {property.type} • {property.bedrooms} bed, {property.bathrooms} bath
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{getStatusBadge(property.property_state)}</td>
                    <td>
                      <strong>${property.price?.toLocaleString()}</strong>
                      <br />
                      <small className="text-muted">{property.price_type}</small>
                    </td>
                    <td>
                      <small className="text-muted" title={property.location?.address}>
                        {property.location?.address?.slice(0, 30)}...
                      </small>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => navigate(`/property/${property.id}`)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </Button>
                        {property.property_state !== "Rented" && property.property_state !== "Sold" && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline-secondary"
                              onClick={() => handleEdit(property.id)}
                              title="Edit Property"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-danger"
                              onClick={() => handleDeleteClick(property.id)}
                              title="Delete Property"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    );
  };

  if (properties.length === 0) {
    return (
      <Card>
        <Card.Body>
          <EmptyPropertiesState />
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="manage-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Manage Properties</h4>
        <Button 
          variant="primary"
          onClick={() => navigate('/owner-dashboard/add-property')}
          style={{backgroundColor: '#e0bcbc', borderColor: '#e0bcbc', color: '#333'}}
        >
          <i className="fas fa-plus me-2"></i>
          Add New Property
        </Button>
      </div>

      {/* Active Listings */}
      {renderPropertyTable(activeListings, "Active Listings")}

      {/* Inactive Listings */}
      {renderPropertyTable(inactiveListings, "Inactive Listings")}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-danger mb-3" style={{fontSize: '48px'}}></i>
            <h5>Are you sure?</h5>
            <p className="text-muted">
              This action cannot be undone. The property will be permanently removed 
              from your listings along with all associated data.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            style={{backgroundColor: '#dc3545', borderColor: '#dc3545'}}
          >
            <i className="fas fa-trash me-2"></i>
            Delete Property
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageProperties;