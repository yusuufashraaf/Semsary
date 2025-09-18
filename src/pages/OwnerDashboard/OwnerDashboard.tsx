import React from "react";
import { Container, Nav } from "react-bootstrap";
import { Outlet, NavLink } from "react-router-dom";

const OwnerDashboardLayout: React.FC = () => {
  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Owner Dashboard</h2>

      <Nav variant="tabs">
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/owner-dashboard"
            end
            style={{ color: "#8C5C5C" }}
          >
            Overview
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/owner-dashboard/manage-properties"
            style={{ color: "#8C5C5C" }}
          >
            Manage Properties
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/owner-dashboard/add-property"
            style={{ color: "#8C5C5C" }}
          >
            Add New Property
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="mt-4">
        <Outlet />
      </div>
    </Container>
  );
};

export default OwnerDashboardLayout;
