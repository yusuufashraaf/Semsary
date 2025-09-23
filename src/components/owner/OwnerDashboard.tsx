import React, { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import "./OwnerDashboard.css";
import Overview from "./DashboardOverview";
import ManageProperties from "./ManageProperties";
import AddProperty from "./AddPropertyForm";
const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
        
      case "manage-properties":
        return <ManageProperties />;
        
      case "add-property":
        return <AddProperty />;
        
      default:
        return <Overview />;
    }
  };

  return (
    <Container fluid className="p-4">
      {/* <h2 className="mb-4">Owner Dashboard</h2> */}
      
      <Nav variant="tabs" className="custom-tabs">
        <Nav.Item>
          <Nav.Link
            active={activeTab === "overview"}
            onClick={() => handleTabChange("overview")}
            className={`custom-tab ${activeTab === "overview" ? "active" : ""}`}
          >
            <i className="fas fa-chart-line me-2"></i>
            Overview
          </Nav.Link>
        </Nav.Item>
        
        <Nav.Item>
          <Nav.Link
            active={activeTab === "manage-properties"}
            onClick={() => handleTabChange("manage-properties")}
            className={`custom-tab ${activeTab === "manage-properties" ? "active" : ""}`}
          >
            <i className="fas fa-building me-2"></i>
            Manage Properties
          </Nav.Link>
        </Nav.Item>
        
        <Nav.Item>
          <Nav.Link
            active={activeTab === "add-property"}
            onClick={() => handleTabChange("add-property")}
            className={`custom-tab ${activeTab === "add-property" ? "active" : ""}`}
          >
            <i className="fas fa-plus-circle me-2"></i>
            Add New Property
          </Nav.Link>
        </Nav.Item>
      </Nav>
      
      <div className="mt-4 tab-content-wrapper">
        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </Container>
  );
};

export default OwnerDashboard;