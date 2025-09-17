import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProperties, removeProperty } from "../../store/Owner/ownerDashboardSlice";
import { RootState, AppDispatch } from "../../store";
import "./ManageProperties.css";
import { useNavigate } from "react-router-dom";

const ManageProperties: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { properties } = useSelector(
    (state: RootState) => state.ownerDashboard
  );

  useEffect(() => {
    dispatch(getProperties());
  }, [dispatch]);

  const activeListings = properties.filter(
    (p) => p.property_state === "Valid" || p.property_state === "Rented"
  );
  const inactiveListings = properties.filter(
    (p) => p.property_state === "Invalid" || p.property_state === "Pending"
  );

  const getStatusClass = (status: string) => {
    return "status-badge"; 
  };

  // Handle Edit
  const handleEdit = (id: number) => {
    navigate(`/property/${id}/edit`);
  };

  // Handle Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      dispatch(removeProperty(id));
    }
  };

  return (
    <div className="manage-container">
      {/* Active Listings */}
      <h5 className="section-title">Active Listings</h5>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeListings.map((property) => (
              <tr key={property.id}>
                <td>{property.title}</td>
                <td>
                  <span className={getStatusClass(property.property_state)}>
                    {property.property_state}
                  </span>
                </td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(property.id)}>
                    Edit
                  </button>
                  |
                  <button onClick={() => handleDelete(property.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inactive Listings */}
      <h5 className="section-title">Inactive Listings</h5>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inactiveListings.map((property) => (
              <tr key={property.id}>
                <td>{property.title}</td>
                <td>
                  <span className={getStatusClass(property.property_state)}>
                    {property.property_state}
                  </span>
                </td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(property.id)}>
                    Edit
                  </button>
                  |
                  <button onClick={() => handleDelete(property.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProperties;
