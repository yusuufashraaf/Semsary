import React from "react";
import { Container, Nav, Tab } from "react-bootstrap";
import DashboardOverview from "../../components/owner/DashboardOverview";
import ManageProperties from "../../components/owner/ManageProperties";
import AddPropertyForm from "../../components/owner/AddPropertyForm";

const OwnerDashboard: React.FC = () => {
  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Owner Dashboard</h2>
      <Tab.Container defaultActiveKey="overview">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="overview" style={{color:"#8C5C5C"}}>Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="manage" style={{color:"#8C5C5C"}}>Manage Properties</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="add" style={{color:"#8C5C5C"}}>Add New Property</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-4">
          <Tab.Pane eventKey="overview">
            <DashboardOverview />
          </Tab.Pane>
          <Tab.Pane eventKey="manage">
            <ManageProperties />
          </Tab.Pane>
          <Tab.Pane eventKey="add">
            <AddPropertyForm />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default OwnerDashboard;
