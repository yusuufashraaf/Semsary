import React, { useEffect } from "react";
import { Table} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getProperties } from "../../store/Owner/ownerDashboardSlice";
import { RootState, AppDispatch } from "../../store";

const ManageProperties: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { properties } = useSelector((state: RootState) => state.ownerDashboard);

  useEffect(() => {
    dispatch(getProperties());
  }, [dispatch]);

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Property Name</th>
            <th>Status</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.title}</td>
              <td>{property.property_state}</td>
              <td>{property.location?.address}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ManageProperties;
