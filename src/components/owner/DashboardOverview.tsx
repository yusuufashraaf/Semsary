import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { getDashboardData } from "../../store/Owner/ownerDashboardSlice";
import { RootState, AppDispatch } from "../../store";

const DashboardOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { overview, loading } = useSelector((state: RootState) => state.ownerDashboard);

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  if (loading) return <Spinner animation="border" />;

  return (
    <Row>
      <Col md={4}>
        <Card className="mb-3 shadow-sm" style={{backgroundColor:"#F2E8E8"}}>
          <Card.Body>
            <Card.Title>Total Properties</Card.Title>
            <Card.Text>{overview.total_properties}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="mb-3 shadow-sm" style={{backgroundColor:"#F2E8E8"}}>
          <Card.Body>
            <Card.Title>Total Bookings</Card.Title>
            <Card.Text>{overview.total_bookings}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="mb-3 shadow-sm" style={{backgroundColor:"#F2E8E8"}}>
          <Card.Body>
            <Card.Title>Total Income</Card.Title>
            <Card.Text>${overview.total_income}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardOverview;
