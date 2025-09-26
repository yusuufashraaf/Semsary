import React, { useState, useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import "./OwnerDashboard.css";
import Overview from "./DashboardOverview";
import ManageProperties from "./ManageProperties";
import AddProperty from "./AddPropertyForm";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getDashboardData, getProperties } from "../../store/Owner/ownerDashboardSlice";
const OwnerDashboard: React.FC = () => {
   const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(getDashboardData());
    dispatch(getProperties());
  }, [dispatch]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
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