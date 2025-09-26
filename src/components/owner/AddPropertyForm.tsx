 import LocationMap from "@components/PropertyDetails/LocationMap";
import React, { useState, useEffect } from "react";
import "./AddPropertyForm.css";
import { Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createProperty } from "../../store/Owner/ownerDashboardSlice";
import { AppDispatch, RootState } from "../../store";
import api from "../../services/axios-global"; 
import { useNavigate } from "react-router-dom";
import { generateDescription } from "../../services/ownerDashboard";
import { useAppSelector } from "@store/hook";

const AddPropertyForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { errors } = useSelector((state: RootState) => state.ownerDashboard);
  const { user } = useAppSelector((state) => state.Authslice);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    type: "Apartment",
    price: "",
    priceType: "FullPay",
    size: "",
    status: "sale",
    query: "",
    selectedLocation: null as any,
    selectedFeatures: [] as number[],
    images: [] as File[],
    previewUrls: [] as string[],
    documents: [] as File[],
    previewUrlsdocs: [] as string[],
  });

  const [results, setResults] = useState<any[]>([]);
  const [features, setFeatures] = useState<{ id: number; name: string }[]>([]);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔔 Modal state
  const [modal, setModal] = useState<{
    show: boolean;
    title: string;
    body: string;
    variant: "success" | "danger";
  }>({ show: false, title: "", body: "", variant: "success" });

  const validateForm = () => {
    const errors: any = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.selectedLocation) errors.location = "Please select a location";
    if (formData.previewUrls.length === 0) errors.images = "At least one image is required";
    if (formData.previewUrlsdocs.length === 0) errors.documents = "Property documents are required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const urls = files.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
        previewUrls: [...prev.previewUrls, ...urls],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(formData.previewUrls[index]);
    const newFiles = [...formData.images];
    const newPreviews = [...formData.previewUrls];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      images: newFiles,
      previewUrls: newPreviews,
    }));
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...files],
        previewUrlsdocs: [...prev.previewUrlsdocs, ...files.map((f) => f.name)],
      }));
    }
  };

  const handleRemoveDocument = (index: number) => {
    const newDocs = [...formData.documents];
    const newPreviewNames = [...formData.previewUrlsdocs];
    newDocs.splice(index, 1);
    newPreviewNames.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      documents: newDocs,
      previewUrlsdocs: newPreviewNames,
    }));
  };

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await api.get("/features");
        setFeatures(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
        setModal({
          show: true,
          title: "Error",
          body: "Failed to fetch features",
          variant: "danger",
        });
      }
    };
    fetchFeatures();
  }, []);

  const handleFeatureToggle = (featureId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter((id) => id !== featureId)
        : [...prev.selectedFeatures, featureId],
    }));
  };

  const handleSearch = async (value: string) => {
    handleChange("query", value);
    if (value.length < 3) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleSelect = (place: any) => {
    setFormData((prev) => ({
      ...prev,
      query: place.display_name,
      selectedLocation: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        address: place.display_name,
      },
    }));
    setResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateForm()) {
      setModal({
        show: true,
        title: "Validation Error",
        body: "Please fix the form errors before submitting",
        variant: "danger",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("bedrooms", formData.bedrooms.toString());
      data.append("bathrooms", formData.bathrooms.toString());
      data.append("type", formData.type);
      data.append("status", formData.status);
      data.append("price", formData.price);
      data.append("price_type", formData.priceType);
      data.append("size", formData.size);
      data.append("location[address]", formData.selectedLocation.address);
      data.append("location[lat]", formData.selectedLocation.lat);
      data.append("location[lng]", formData.selectedLocation.lng);
      formData.images.forEach((file, i) => data.append(`images[${i}]`, file));
      formData.documents.forEach((file) => data.append("documents[]", file));

      await dispatch(createProperty(data)).unwrap();

      setModal({
        show: true,
        title: "Success 🎉",
        body: "Your property has been saved successfully. It is now pending review and will be published once approved.",
        variant: "success",
      });

      setFormData({
        title: "",
        description: "",
        bedrooms: 1,
        bathrooms: 1,
        type: "Apartment",
        price: "",
        priceType: "FullPay",
        size: "",
        status: "sale",
        query: "",
        selectedLocation: null as any,
        selectedFeatures: [],
        images: [],
        previewUrls: [],
        documents: [],
        previewUrlsdocs: [],
      });
    } catch (error: any) {
      setModal({
        show: true,
        title: "Error ❌",
        body: "Failed to save property. Please try again.",
        variant: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
      <>
      {/* user is not valid he can not access this form User sees Property form is disabled with a message stuck "you are not yet a valid user" */}

      {user?.status !== "active" ? (
      <div className="text-center py-5">
        <h4 className="text-danger mb-3">🚫 You are not yet a valid user</h4>
        <p className="text-muted">
          Your account is not active. Please contact support or wait until your account gets approved.
        </p>
      </div>
    ) : (
      <>
        {/* Validation Summary */}
        {Object.keys(validationErrors).length > 0 && (
          <Alert variant="danger" className="mb-4">
            <Alert.Heading>Please fix the following errors:</Alert.Heading>
            <ul className="mb-0">
              {Object.entries(validationErrors).map(([field, message]) => (
                <li key={field}>{message as string}</li>
              ))}
            </ul>
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          {/* Title */}
          <Form.Group className="mb-3">
            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              className={`custom-input ${errors?.title || validationErrors.title ? "is-invalid" : ""}`}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter property title (minimum 5 characters)"
              maxLength={100}
              disabled={isSubmitting}
            />
            <Form.Text className="text-muted">
              {formData.title.length}/100 characters
            </Form.Text>
            {(errors?.title || validationErrors.title) && (
              <div className="invalid-feedback">
                {errors?.title ? errors.title[0] : validationErrors.title}
              </div>
            )}
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.description}
              className={`custom-input ${errors?.description || validationErrors.description ? "is-invalid" : ""}`}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter detailed property description (minimum 10 characters)"
              maxLength={1000}
              disabled={isSubmitting}
            />
            <Form.Text className="text-muted">
              {formData.description.length}/1000 characters
            </Form.Text>
            {(errors?.description || validationErrors.description) && (
              <div className="invalid-feedback">
                {errors?.description ? errors.description[0] : validationErrors.description}
              </div>
            )}
          </Form.Group>
            <button
              type="button"
              disabled={isSubmitting}
              className="generate-btn"
              onClick={async () => {
                if (!formData.title || !formData.bedrooms || !formData.size || !formData.selectedLocation) {
                  setModal({
                      show: true,
                      title: "Validation Error ⚠️",
                      body: "Please fill in Title, Rooms, Size, and Location first",
                      variant: "danger",
                    });

                  return;
                }
                try {
                  setIsSubmitting(true);
                  const result = await generateDescription({
                    title: formData.title,
                    bedrooms: formData.bedrooms,
                    bathrooms: formData.bathrooms,
                    size: Number(formData.size),
                    location: formData.selectedLocation.address
                  });
                  const cleanDescription = typeof result === 'string'
                  ? result.substring(0, 500).trim()
                  : result;
                  setFormData(prev => ({ ...prev, description: cleanDescription }));
                  setModal({
                        show: true,
                        title: "Success 🎉",
                        body: "Description generated successfully",
                        variant: "success",
                      });
                } catch (error) {
                  console.error(error);
                 setModal({
                        show: true,
                        title: "Error ❌",
                        body: "Failed to generate description",
                        variant: "danger",
                      });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {isSubmitting && <div className="generate-btn-spinner"></div>}
              {!isSubmitting && (
                <>
                  <span className="generate-btn-icon">✨</span>
                  <div className="sparkle sparkle-1"></div>
                  <div className="sparkle sparkle-2"></div>
                </>
              )}
              <span className="generate-btn-text">
                {isSubmitting ? 'Generating...' : 'Generate Description'}
              </span>
            </button>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Bedrooms <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={20}
                  value={formData.bedrooms}
                  className={`custom-input ${validationErrors.bedrooms ? "is-invalid" : ""}`}
                  onChange={(e) => handleChange("bedrooms", Number(e.target.value))}
                  placeholder="Number of bedrooms"
                  disabled={isSubmitting}
                />
                {validationErrors.bedrooms && (
                  <div className="invalid-feedback">{validationErrors.bedrooms}</div>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Bathrooms <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={20}
                  value={formData.bathrooms}
                  className={`custom-input ${validationErrors.bathrooms ? "is-invalid" : ""}`}
                  onChange={(e) => handleChange("bathrooms", Number(e.target.value))}
                  placeholder="Number of bathrooms"
                  disabled={isSubmitting}
                />
                {validationErrors.bathrooms && (
                  <div className="invalid-feedback">{validationErrors.bathrooms}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={formData.type}
                  className={`custom-input ${errors?.type ? "is-invalid" : ""}`}
                  onChange={(e) => handleChange("type", e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Roof">Roof</option>
                  <option value="Land">Land</option>
                </Form.Select>
                {errors?.type && <div className="invalid-feedback">{errors.type[0]}</div>}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Size (sq ft) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={50000}
                  value={formData.size}
                  className={`custom-input ${errors?.size || validationErrors.size ? "is-invalid" : ""}`}
                  onChange={(e) => handleChange("size", e.target.value)}
                  placeholder="Property size in square feet"
                  disabled={isSubmitting}
                />
                {(errors?.size || validationErrors.size) && (
                  <div className="invalid-feedback">
                    {errors?.size ? errors.size[0] : validationErrors.size}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.status}
                    className={`custom-input ${errors?.size || validationErrors.size ? "is-invalid" : ""}`}
                    onChange={(e) => handleChange("status", e.target.value)}
                    placeholder="Select status"
                    disabled={isSubmitting}
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </Form.Control>
                  {(errors?.status || validationErrors.size) && (
                  <div className="invalid-feedback">
                    {errors?.status ? errors.status[0] : validationErrors.status}
                  </div>
                )}
                </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Price <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={100000000}
                  value={formData.price}
                  className={`custom-input ${errors?.price || validationErrors.price ? "is-invalid" : ""}`}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="Enter price"
                  disabled={isSubmitting}
                />
                {(errors?.price || validationErrors.price) && (
                  <div className="invalid-feedback">
                    {errors?.price ? errors.price[0] : validationErrors.price}
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Price Type <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  value={formData.priceType}
                  className={`custom-input ${errors?.price_type ? "is-invalid" : ""}`}
                  onChange={(e) => handleChange("priceType", e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="FullPay">Full Payment</option>
                  <option value="Monthly">Monthly Rent</option>
                  <option value="Daily">Daily Rent</option>
                </Form.Select>
                {errors?.price_type && (
                  <div className="invalid-feedback">{errors.price_type[0]}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Location */}
          <Form.Group className="mb-3">
            <Form.Label>Location <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              value={formData.query}
              className={`custom-input ${validationErrors.location ? "is-invalid" : ""}`}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Type to search for a location..."
              disabled={isSubmitting}
            />
            {results.length > 0 && (
              <ul className="list-group position-absolute w-100" style={{zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                {results.slice(0, 5).map((place) => (
                  <li
                    key={place.place_id}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSelect(place)}
                    style={{cursor: 'pointer'}}
                  >
                    <small>{place.display_name}</small>
                  </li>
                ))}
              </ul>
            )}
            {validationErrors.location && (
              <div className="invalid-feedback d-block">{validationErrors.location}</div>
            )}
            {formData.selectedLocation && (
              <Form.Text className="text-success">
                ✓ Selected: {formData.selectedLocation.address}
              </Form.Text>
            )}
          </Form.Group>

          <div className="mb-3">
            <LocationMap
              lat={formData.selectedLocation ? formData.selectedLocation.lat : 0}
              lng={formData.selectedLocation ? formData.selectedLocation.lng : 0}
              height={320}
            />
          </div>

          {/* Features */}
          <Form.Group className="mb-4">
            <Form.Label>Features</Form.Label>
            <Row>
              {features.map((feature) => (
                <Col md={4} sm={6} key={feature.id} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`feature-${feature.id}`}
                    label={feature.name}
                    checked={formData.selectedFeatures.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                    disabled={isSubmitting}
                  />
                </Col>
              ))}
            </Row>
            {errors?.features && (
              <div className="text-danger small mt-2">{errors.features[0]}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
          <Form.Label>
            Property Images <span className="text-danger">*</span>
          </Form.Label>
          <label htmlFor="file-upload" className="upload-box">
            <p className="fw-bold mb-1">Upload Photos</p>
            <span className="upload-btn">Upload</span>
            <input
              type="file"
              id="file-upload"
              className="d-none"
              multiple
              accept="image/*"
              onChange={handleFileChange} 
            />
            <p className="text-muted small mb-0">
              Drag and drop images here or click to browse<br />
              Maximum 10 images, 5MB each. Supported formats: JPG, PNG, GIF
            </p>
          </label>

          {/* Image Preview */}
          {formData.previewUrls.length > 0 && (
            <div className="mt-3">
              <div className="row g-3">
                {formData.previewUrls.map((url, i) => (
                  <div key={i} className="col-md-3 col-sm-4 col-6">
                    <div className="position-relative">
                      <img
                        src={url}
                        alt={`Preview ${i + 1}`}
                        className="img-fluid rounded shadow-sm"
                        style={{
                          aspectRatio: "1",
                          objectFit: "cover",
                          width: "100%",
                          height: "150px",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-2"
                        onClick={() => handleRemoveImage(i)}
                        disabled={isSubmitting}
                        style={{ width: "25px", height: "25px" }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Form.Group>

        {/* contract / documents */}
         <Form.Group className="mb-4">
          <Form.Label>
            Property Documents <span className="text-danger">*</span>
          </Form.Label>
          <label 
            htmlFor="documents-upload" 
            className={`upload-box ${validationErrors.documents || errors?.documents ? 'is-invalid' : ''}`}
          >
            <p className="fw-bold mb-1">Upload Documents</p>
            <span className="upload-btn">Upload</span>
            <input
              type="file"
              id="documents-upload"
              className="d-none"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleDocumentsChange}
              disabled={isSubmitting}
            />
            <p className="text-muted small mb-0">
              Supported formats: PDF, Word, Excel <br />
              Max size: 5MB per file
            </p>
          </label>

            {formData.previewUrlsdocs.length > 0 && (
              <ul className="mt-2 list-group">
                {formData.previewUrlsdocs.map((name, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="text-success">📄 {name}</span>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveDocument(i)}
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* عرض validation errors */}
            {(validationErrors.documents || errors?.documents) && (
              <div className="invalid-feedback d-block mt-2">
                {errors?.documents ? 
                  (Array.isArray(errors.documents) ? errors.documents[0] : errors.documents) : 
                  validationErrors.documents}
              </div>
            )}
          </Form.Group>
          <div className="d-flex gap-3">
            <Button 
              variant="success" 
              type="submit" 
              disabled={isSubmitting}
              className="px-4"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                'Save Property'
              )}
            </Button>
          </div>
      </Form>
      {/*Modal Notifications */}
      <Modal show={modal.show} onHide={() => setModal((prev) => ({ ...prev, show: false }))}>
        <Modal.Header closeButton>
          <Modal.Title className={modal.variant === "success" ? "text-success" : "text-danger"}>
            {modal.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{modal.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal((prev) => ({ ...prev, show: false }))}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </>
      
    )}
  </>
    )
  };

  export default AddPropertyForm;