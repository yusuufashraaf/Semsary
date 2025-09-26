import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProperties,
  changePropertyStatus,
  type Property,
} from "@services/PropertiesFetch";
import { getOwner, type Owner } from "@services/OwnersFetch";
import { Spinner, Table, Button, Form } from "react-bootstrap";

type VerificationStatus = "Valid" | "Rejected";

// Define the full set of possible property states
type PropertyState = "Valid" | "Invalid" | "Pending" | "Rented" | "Sold" | "Rejected";

interface Props {
  jwt: string | null;
  className?: string;
}

const CsAgentDashboard: React.FC<Props> = ({ jwt, className }) => {
  const queryClient = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>({});
  const [warning, setWarning] = useState<Record<number, string>>({});
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [updateErrors, setUpdateErrors] = useState<Record<number, string>>({});
  

  const [propertyStateFilter, setPropertyStateFilter] = useState<PropertyState | "">("Pending");
  
  const propertyStateOptions: (PropertyState | "")[] = [
    "", // Empty string for "All"
    "Pending", 
    "Valid", 
    "Rejected", 
    "Invalid", 
    "Rented", 
    "Sold"
  ];

  // 📌 Properties query
  const {
    data: propertiesResponse,
    isLoading,
    error,
  } = useQuery({
    // 2. ✅ MODIFIED: Added propertyStateFilter to queryKey
    queryKey: ["properties", propertyStateFilter], 
    // 3. ✅ MODIFIED: Pass propertyStateFilter to queryFn (assuming getProperties accepts it)
    queryFn: () => getProperties(jwt, { property_state: propertyStateFilter || undefined }), 
    enabled: !!jwt,
    staleTime: 30_000,
  });

  // 📌 Owner query (runs only if selectedOwnerId set)
  const {
    data: ownerData,
    isLoading: ownerLoading,
    error: ownerError,
  } = useQuery({
    queryKey: ["owner", selectedOwnerId],
    queryFn: () => getOwner(selectedOwnerId!, jwt),
    enabled: !!selectedOwnerId && !!jwt,
  });

  // 📌 Mutation for property status
  const mutation = useMutation({
    mutationFn: (vars: { id: number; status: VerificationStatus }) =>
      changePropertyStatus(vars.id, vars.status, jwt),
    onMutate: (vars) => {
      setUpdatingId(vars.id); 
      setUpdateErrors((prev) => {
        const copy = { ...prev };
        delete copy[vars.id]; // clear old error for this property
        return copy;
      });
    },
    onError: (err, vars) => {
      setUpdateErrors((prev) => ({
        ...prev,
        [vars.id]: "❌ Update failed. Try again.",
      }));
    },
    onSettled: () => {
      setUpdatingId(null);
    },
    onSuccess: () => {
      // Invalidate all queries starting with "properties" to refetch the current filtered list
      queryClient.invalidateQueries({ queryKey: ["properties"], exact: false }); 
    },
  });

  // Helper function to handle filter change
  const handleFilterChange = (newFilter: PropertyState | "") => {
    setPropertyStateFilter(newFilter);
  };

  if (!jwt) return <div className={className}>No JWT provided.</div>;
  if (isLoading) return <Spinner animation="border" />;
  if (error) return <div className="text-danger">Failed to load properties</div>;

  const properties: Property[] = propertiesResponse?.data ?? [];

  // 🔹 Owner Detail View (unchanged)
  if (selectedOwnerId) {
    if (ownerLoading) return <Spinner animation="border" />;
    if (ownerError) return <div className="text-danger">Failed to load owner</div>;

    const owner: Owner = ownerData;

    return (
      <div className={className}>
        <h3>Owner Details</h3>
        <p><b>ID:</b> {owner.id}</p>
        <p><b>Name:</b> {owner.first_name} {owner.last_name}</p>
        <p><b>Email:</b> {owner.email}</p>
        <p><b>Phone:</b> {owner.phone_number}</p>
        <p><b>Status:</b> {owner.status}</p>

        <Button variant="secondary" onClick={() => setSelectedOwnerId(null)}>
          ← Back to Properties
        </Button>
      </div>
    );
  }

  // 🔹 Property Detail View (unchanged)
  if (selectedProperty) {
    return (
      <div className={className}>
        <h3>{selectedProperty.title}</h3>
        <p><b>ID:</b> {selectedProperty.id}</p>
        <p>
          <b>Owner:</b>{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => setSelectedOwnerId(selectedProperty.owner?.id ?? null)}
          >
            Owner #{selectedProperty.owner?.id}
          </Button>
        </p>
        <p><b>Type:</b> {selectedProperty.type}</p>
        <p><b>Price:</b> {selectedProperty.property_details.price} ({selectedProperty.property_details.price_type})</p>
        <p><b>Size:</b> {selectedProperty.property_details.size}</p>
        <p>
          <b>Location:</b>{" "}
          {selectedProperty.location?.city}, {selectedProperty.location?.state}
        </p>
        <p><b>Property State:</b> {selectedProperty.status}</p>
        <p><b>Status:</b> {selectedProperty.status}</p>
        <p><b>Description:</b> {selectedProperty.description}</p>

        {/* 📸 Property Photos */}
        {selectedProperty.image && selectedProperty.image.length > 0 ? (
          <div className="mt-3">
            <h5>Photos</h5>
            <div className="d-flex flex-wrap gap-3">
              {selectedProperty.image.map((img, idx) => (
                <img
                  key={idx}
                  src={typeof img === "string" ? img : img}
                  alt={`Property ${selectedProperty.id} - ${idx + 1}`}
                  style={{
                    width: "200px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted mt-3">No photos available for this property.</p>
        )}

        {/* 📄 Property Documents */}
        {selectedProperty.documents && selectedProperty.documents.length > 0 ? (
          <div className="mt-4">
            <h5>Documents</h5>
            <ul>
              {selectedProperty.documents.map((doc, idx) => (
                <li key={idx}>
                  <a
                    href={typeof doc === "string" ? doc : doc}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 Document {idx + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-muted mt-3">No documents available for this property.</p>
        )}

        <Button
          variant="secondary"
          className="mt-3"
          onClick={() => setSelectedProperty(null)}
        >
          ← Back to Properties
        </Button>
      </div>
    );
  }


  // 🔹 Table View
  return (
    <div className={className}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Properties</h3>
        
        {/* 4. ✅ ADDED: Filter Control */}
        <Form.Group className="d-flex align-items-center mb-0">
          <Form.Label className="me-2 mb-0 small text-muted">Filter by State:</Form.Label>
          <Form.Select
            size="sm"
            value={propertyStateFilter}
            onChange={(e) => 
              handleFilterChange(e.target.value as PropertyState | "")
            }
            style={{ width: "150px" }}
          >
            {propertyStateOptions.map((state) => (
              <option key={state} value={state}>
                {state === "" ? "All States" : state}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Owner</th>
            <th>Property State</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {properties.length > 0 ? (
            properties.map((p) => {
              const current = selectedStatus[p.id] ?? "";

              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => setSelectedProperty(p)}
                    >
                      {p.title}
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => setSelectedOwnerId(p.owner?.id ?? null)}
                    >
                      Owner #{p.owner?.id}
                    </Button>
                  </td>
                  <td>{p.status}</td>
                  <td>
                    {p.status === "Pending" ? (
                      <div className="d-flex gap-2 align-items-center">
                        <Form.Select
                          size="sm"
                          value={current}
                          onChange={(e) => {
                            setSelectedStatus((s) => ({ ...s, [p.id]: e.target.value }));
                            setWarning((w) => ({ ...w, [p.id]: "" }));
                          }}
                        >
                          <option value="">-- Select --</option>
                          <option value="Valid">Valid</option>
                          <option value="Rejected">Rejected</option>
                        </Form.Select>

                        <Button
                          size="sm"
                          variant="primary"
                          disabled={updatingId === p.id && mutation.isPending}
                          onClick={() => {
                            if (!current) {
                              setWarning((w) => ({
                                ...w,
                                [p.id]: "⚠️ Please choose a status first",
                              }));
                              return;
                            }
                            mutation.mutate({
                              id: p.id,
                              status: current as VerificationStatus,
                            });
                          }}
                        >
                          {updatingId === p.id && mutation.isPending ? "Updating…" : "Update"}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted small">No actions (state: {p.status})</span>
                    )}

                    {warning[p.id] && (
                      <div className="text-warning small mt-1">{warning[p.id]}</div>
                    )}
                    {updateErrors[p.id] && (
                      <div className="text-danger small mt-1">{updateErrors[p.id]}</div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
                <td colSpan={5} className="text-center py-4">
                    No properties found
                </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CsAgentDashboard;