import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Button, Nav, Tab, Modal} from "react-bootstrap";
import { EdittProperty, getProperties, removeProperty, getDashboardData} from "../../store/Owner/ownerDashboardSlice";
import { RootState, AppDispatch } from "../../store";
import { useAppSelector } from "@store/hook";
import { useNavigate } from "react-router-dom";
import "./DashboardOverview.css";
import { toast } from "react-toastify";
import { Building, Calendar, DollarSign, Home, Eye } from "lucide-react";
import Loader from "@components/common/Loader/Loader";
import { getEcho } from "@services/echoManager";

const DashboardOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { overview, loading, properties } = useSelector(
    (state: RootState) => state.ownerDashboard
  );
  const { user } = useAppSelector((state) => state.Authslice);

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [propertyToDelete, setPropertyToDelete] = React.useState<number | null>(null);

  useEffect(()=>{
  dispatch(getProperties());
  dispatch(getDashboardData())
  },[dispatch])

  useEffect(() => {
  const echo = getEcho();
  if (!echo || !user) return;

  // Subscribe to user's property updates
  const channel = echo.private(`user.${user.id}`);

  channel.listen(".property.updated", (e: any) => {


    // Update local state immediately
    setPropertyStates((prev) => ({
      ...prev,
      [e.id]: e.property_state,
    }));

    // Optional toast
    toast.info(`Property "${e.title}" status updated to ${e.property_state}`, {
      toastId: `property-update-${e.id}`, // prevent duplicate toasts
      autoClose: 3000,
    });
  });

  return () => {
    echo.leave(`user.${user.id}`);
  };
}, [user]);

  const [activeKey, setActiveKey] = useState<string>("all");
  // Local state to track property states for immediate UI updates
  const [propertyStates, setPropertyStates] = useState<{[key: number]: string}>({});

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Loader />
      </div>
    );
  }

  // Get current property state (local state takes precedence)
  const getCurrentPropertyState = (property: any) => {
    return propertyStates[property.id] ?? property.property_state;
  };

  // Filtered properties by tabs - using current state
  const getFilteredProperties = () => {
    const propertiesWithCurrentState = properties.map(property => ({
      ...property,
      property_state: getCurrentPropertyState(property)
    }));

    return {
      all: propertiesWithCurrentState,
      sale: propertiesWithCurrentState.filter(
        (p) => p.property_state === "Valid" && p.status === "sale"
      ),
      rent: propertiesWithCurrentState.filter(
        (p) => p.property_state === "Valid" && p.status === "rent"
      ),
      sold: propertiesWithCurrentState.filter((p) => p.property_state === "Sold"),
      // rented: propertiesWithCurrentState.filter((p) => p.property_state === "Rented"),
    };
  };

  const filteredProperties = getFilteredProperties();

  const handlePropertyStateChange = async (propertyId: number, newState: string) => {
    // Update local state immediately for instant UI feedback
    setPropertyStates(prev => ({
      ...prev,
      [propertyId]: newState
    }));

    try {
      // Dispatch the API call
      const formData = new FormData();
      formData.append("property_state", newState);
      
      await dispatch(EdittProperty({
        id: String(propertyId),
        data: formData,
      })).unwrap();
      
      // If successful, remove from local state (Redux store will have updated value)
      setPropertyStates(prev => {
        const newState = { ...prev };
        delete newState[propertyId];
        return newState;
      });
    } catch (error) {
      // If failed, revert local state
      setPropertyStates(prev => {
        const newState = { ...prev };
        // delete newState[propertyId];
        return newState;
      });
      console.error("Failed to update property state:", error);
    }
  };

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

  // Handle Delete
      const handleDeleteClick = (id: number) => {
        setPropertyToDelete(id);
        setShowDeleteModal(true);
      };
    
      const confirmDelete = async () => {
      if (propertyToDelete) {
        try {
          // Remove any existing toasts first
          toast.dismiss();
          
          const result = await dispatch(removeProperty(propertyToDelete)).unwrap();
          
          // Only show toast here, not in Redux slice
          toast.success("Property deleted successfully", {
            toastId: `delete-${propertyToDelete}`, // Unique ID to prevent duplicates
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
          
          setShowDeleteModal(false);
          setPropertyToDelete(null);
        } catch (error) {
          toast.error("Failed to delete property", {
            toastId: `delete-error-${propertyToDelete}`, // Unique ID
            autoClose: 3000,
          });
          console.error("Delete error:", error);
        }
      }
    };

  const renderPropertiesTable = (list: any[]) => {
    if (list.length === 0) {
      return (
        <Card className="empty-state-card">
          <Card.Body>
            <EmptyPropertiesState />
          </Card.Body>
        </Card>
      );
    }

    return (
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
                {list.map((property) => {
                  const currentState = getCurrentPropertyState(property);
                  const isEditable = currentState === "Valid" || currentState === "Invalid";
                  
                  return (
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
                            <small className="text-muted property-type">
                              {property.type}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        {isEditable ? (
                          <select
                            className={`status-badge ${
                              currentState === "Valid" ? "status-valid" : "status-invalid"
                            }`}
                            value={currentState}
                            onChange={(e) => handlePropertyStateChange(property.id, e.target.value)}
                          >
                            <option value="Valid">Valid</option>
                            <option value="Invalid">Invalid</option>
                          </select>
                        ) : (
                          <span
                            className={`status-badge ${
                              currentState === "Valid"
                                ? "status-valid"
                                : currentState === "Invalid"
                                ? "status-invalid"
                                : currentState === "Rented"
                                ? "status-rented"
                                : currentState === "Pending"
                                ? "status-pending"
                                : "status-inactive"
                            }`}
                          >
                            {currentState}
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        <div className="location-text">
                          {property.location?.address?.slice(0, 30)}...
                        </div>
                      </td>
                      <td className="py-2 pe-3">
                        <div className="d-flex gap-2">
                          <Button
                          size="sm"
                          variant="outline-primary"
                          className="view-btn"
                          onClick={() => navigate(`/property/${property.id}`)}
                        >
                          <Eye size={12} className="me-1" />
                          View
                        </Button>
                        {property.property_state !== "Rented" && (
                          <Button 
                              size="sm" 
                              variant="outline-danger"
                              onClick={() => handleDeleteClick(property.id)}
                              title="Delete Property"
                            >
                              <i className="fas fa-trash">Delete</i>
                            </Button>
                        )}
                        </div>
                        
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <>
      {/* Stats Section */}
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
                  <div className="stat-value">
                    {overview?.total_properties || 0}
                  </div>
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
                  <div className="stat-label">Rent Income</div>
                  <div className="stat-value">
                    ${overview?.rent_income || 0}
                  </div>
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
                  <div className="stat-label">Sales Income</div>
                  <div className="stat-value">
                    ${overview?.sales_income || 0}
                  </div>
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
                  <div className="stat-label">Total Income</div>
                  <div className="stat-value">
                    ${overview?.total_income || 0}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Properties Tabs */}
      <Tab.Container
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k || "all")}
      >
        <Nav variant="tabs" className="custom-tabs mb-3">
          <Nav.Item>
            <Nav.Link eventKey="all">All Properties</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="sale">For Sale</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="rent">For Rent</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="sold">Sold</Nav.Link>
          </Nav.Item>
          {/* <Nav.Item>
            <Nav.Link eventKey="rented">Rented</Nav.Link>
          </Nav.Item> */}
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="all">
            {renderPropertiesTable(filteredProperties.all)}
          </Tab.Pane>
          <Tab.Pane eventKey="sale">
            {renderPropertiesTable(filteredProperties.sale)}
          </Tab.Pane>
          <Tab.Pane eventKey="rent">
            {renderPropertiesTable(filteredProperties.rent)}
          </Tab.Pane>
          <Tab.Pane eventKey="sold">
            {renderPropertiesTable(filteredProperties.sold)}
          </Tab.Pane>
          {/* <Tab.Pane eventKey="rented">
            {renderPropertiesTable(filteredProperties.rented)}
          </Tab.Pane> */}
        </Tab.Content>
      </Tab.Container>
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
    </>
  );
};

export default DashboardOverview;