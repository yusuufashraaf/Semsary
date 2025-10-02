import React, { useState, useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import "./OwnerDashboard.css";
import Overview from "./DashboardOverview";
import AddProperty from "./AddPropertyForm";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getDashboardData, getProperties } from "../../store/Owner/ownerDashboardSlice";
import { useAppSelector } from "@store/hook";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getEcho } from "@services/echoManager";
const OwnerDashboard: React.FC = () => {
   const dispatch = useDispatch<AppDispatch>();
   const navigate = useNavigate();
   const {user} = useAppSelector(state => state.Authslice)
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(getDashboardData());
    dispatch(getProperties());
  }, [dispatch]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  useEffect(()=>{
    if(user?.status !== "active"){
      navigate('/');
    }
  },[])
  useEffect(() => {
    if (!user) return;

    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`user.${user.id}`);

    const propertyListener = (event: any) => {
      console.log("Property update event:", event);
      if (event.title) {
        toast.info(`Your property "${event.title}" has been updated`);
      }
    };

    channel.listen(".property.updated", propertyListener);

    return () => {
      channel.stopListening(".property.updated", propertyListener);
      echo.leave(`user.${user.id}`);
    };
  }, [user]);

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