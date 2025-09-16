import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { getDashboardData, getProperties } from "../../store/Owner/ownerDashboardSlice";
import { RootState, AppDispatch } from "../../store";
// import "./DashboardOverview.css";

const DashboardOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { overview, loading, properties } = useSelector(
    (state: RootState) => state.ownerDashboard
  );

  useEffect(() => {
    dispatch(getDashboardData());
    dispatch(getProperties());
  }, [dispatch]);

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      {/* Cards */}
      <Row>
        <Col md={4}>
          <Card className="mb-3 shadow-sm" style={{ backgroundColor: "#F2E8E8" }}>
            <Card.Body>
              <Card.Title>Total Properties</Card.Title>
              <Card.Text>{overview.total_properties}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 shadow-sm" style={{ backgroundColor: "#F2E8E8" }}>
            <Card.Body>
              <Card.Title>Total Bookings</Card.Title>
              <Card.Text>{overview.total_bookings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 shadow-sm" style={{ backgroundColor: "#F2E8E8" }}>
            <Card.Body>
              <Card.Title>Total Income</Card.Title>
              <Card.Text>${overview.total_income}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Properties Table */}
      <h5 className="section-title">All Properties</h5>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Status</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>{property.title}</td>
                <td>
                  <span className="status-badge">{property.property_state}</span>
                </td>
                <td>{property.location?.address}</td>
                <td className="actions">
                  <button className="view-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardOverview;
