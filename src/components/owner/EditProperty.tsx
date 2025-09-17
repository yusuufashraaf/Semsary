import LocationMap from "@components/PropertyDetails/LocationMap";
import React, { useState, useEffect } from "react";
import "./AddPropertyForm.css";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { EdittProperty} from "../../store/Owner/ownerDashboardSlice";
import { AppDispatch, RootState } from "../../store";
import api from "../../services/axios-global"; 
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { errors } = useSelector((state: RootState) => state.ownerDashboard);

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [features, setFeatures] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        
        console.log('API Response:', res.data);
        
        const property = res.data?.data || res.data || res.data?.property;
        
        if (!property) {
          throw new Error('Property data not found in response');
        }

        console.log('Property data:', property);

        // Process images with proper URLs
        const processedImages = Array.isArray(property.images) 
          ? property.images.map((img: any) => {
              // If image is object with image_url property (Cloudinary)
              if (typeof img === 'object' && img.image_url) {
                return img.image_url;
              }
              // If image is string, return as is
              if (typeof img === 'string') {
                return img.startsWith('http') ? img : `${api.defaults.baseURL || 'http://localhost:8000'}${img}`;
              }
              // If image is object with url property
              if (img.url) {
                return img.url.startsWith('http') ? img.url : `${api.defaults.baseURL || 'http://localhost:8000'}${img.url}`;
              }
              // If image has path property
              if (img.path) {
                return img.path.startsWith('http') ? img.path : `${api.defaults.baseURL || 'http://localhost:8000'}${img.path}`;
              }
              return img;
            })
          : [];

        console.log('Processed images:', processedImages);

        setFormData({
          title: property.title || "",
          description: property.description || "",
          bedrooms: property.bedrooms || 1,
          bathrooms: property.bathrooms || 1,
          type: property.type || "Apartment",
          price: property.price || "",
          priceType: property.price_type || property.priceType || "FullPay",
          size: property.size || "",
          query: property.location?.address || property.address || "",
          selectedLocation: property.location || (property.lat && property.lng ? {
            lat: property.lat,
            lng: property.lng,
            address: property.address || ""
          } : null),
          selectedFeatures: property.features?.map((f: any) => f.id) || [],
          images: [] as File[],
          previewUrls: processedImages,
        });
        
      } catch (err) {
        console.error('Error fetching property:', err);
        toast.error("Failed to fetch property details");
        navigate('/ownerdashboard');
      } finally {
        setLoading(false);
      }
    };

    const fetchFeatures = async () => {
      try {
        const res = await api.get("/features");
        setFeatures(res.data?.data || res.data || []);
      } catch (err) {
        console.error('Error fetching features:', err);
        toast.error("Failed to fetch features");
      }
    };

    if (id) {
      fetchProperty();
      fetchFeatures();
    } else {
      setLoading(false);
      toast.error("Property ID is missing");
      navigate('/ownerdashboard');
    }
  }, [id, navigate]);

  // Client-side validation function
  const validateForm = () => {
    const errors: any = {};

    // Title validation
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters long";
    } else if (formData.title.trim().length > 100) {
      errors.title = "Title must be less than 100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters long";
    } else if (formData.description.trim().length > 1000) {
      errors.description = "Description must be less than 1000 characters";
    }

    // Bedrooms validation
    if (!formData.bedrooms || formData.bedrooms < 1) {
      errors.bedrooms = "At least 1 bedroom is required";
    } else if (formData.bedrooms > 20) {
      errors.bedrooms = "Maximum 20 bedrooms allowed";
    }

    // Bathrooms validation
    if (!formData.bathrooms || formData.bathrooms < 1) {
      errors.bathrooms = "At least 1 bathroom is required";
    } else if (formData.bathrooms > 20) {
      errors.bathrooms = "Maximum 20 bathrooms allowed";
    }

    // Price validation
    if (!formData.price || Number(formData.price) <= 0) {
      errors.price = "Price must be greater than 0";
    } else if (Number(formData.price) > 100000000) {
      errors.price = "Price is too high";
    }

    // Size validation
    if (!formData.size || Number(formData.size) <= 0) {
      errors.size = "Size must be greater than 0";
    } else if (Number(formData.size) > 50000) {
      errors.size = "Size is too large";
    }

    // Location validation
    if (!formData.selectedLocation) {
      errors.location = "Please select a location";
    }

    // Images validation
    if (formData.previewUrls.length === 0) {
      errors.images = "At least one image is required";
    } else if (formData.previewUrls.length > 10) {
      errors.images = "Maximum 10 images allowed";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Real-time validation on field change
  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
    
    // Clear validation error for this field
    if (validationErrors[key]) {
      setValidationErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Improved file input with better preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate file types and sizes
      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error(`${file.name} is too large. Maximum size is 5MB`);
          return false;
        }
        return true;
      });

      const urls = validFiles.map((file) => URL.createObjectURL(file));

      setFormData((prev: any) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
        previewUrls: [...prev.previewUrls, ...urls],
      }));

      // Clear images validation error if exists
      if (validationErrors.images && (formData.previewUrls.length + validFiles.length) > 0) {
        setValidationErrors((prev: any) => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    // Only revoke object URL if it's a blob URL (new uploads)
    if (formData.previewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(formData.previewUrls[index]);
    }
    
    const newFiles = [...formData.images];
    const newPreviews = [...formData.previewUrls];
    
    // If removing an existing image (server image), we don't remove from files array
    if (index < formData.previewUrls.length - formData.images.length) {
      // This is an existing server image
      newPreviews.splice(index, 1);
    } else {
      // This is a new uploaded file
      const fileIndex = index - (formData.previewUrls.length - formData.images.length);
      newFiles.splice(fileIndex, 1);
      newPreviews.splice(index, 1);
    }

    setFormData((prev: any) => ({
      ...prev,
      images: newFiles,
      previewUrls: newPreviews,
    }));
  };

  const handleFeatureToggle = (featureId: number) => {
    setFormData((prev: any) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter((id: number) => id !== featureId)
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
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleSelect = (place: any) => {
    setFormData((prev: any) => ({
      ...prev,
      query: place.display_name,
      selectedLocation: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        address: place.display_name,
      },
    }));
    setResults([]);

    // Clear location validation error
    if (validationErrors.location) {
      setValidationErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors.location;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Run client-side validation
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("bedrooms", formData.bedrooms.toString());
      data.append("bathrooms", formData.bathrooms.toString());
      data.append("type", formData.type);
      data.append("price", formData.price);
      data.append("price_type", formData.priceType);
      data.append("size", formData.size);
      data.append("location[address]", formData.selectedLocation.address);
      data.append("location[lat]", formData.selectedLocation.lat);
      data.append("location[lng]", formData.selectedLocation.lng);

      formData.selectedFeatures.forEach((f: number, i: number) => {
        data.append(`features[${i}]`, f.toString());
      });

      formData.images.forEach((file: File, i: number) => {
        data.append(`images[${i}]`, file);
      });

      await dispatch(EdittProperty({ id: id!, data })).unwrap();
      
      toast.success("Property updated successfully");
      
      // Clean up object URLs
      formData.previewUrls.forEach((url: string) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      
      navigate('/ownerdashboard');
      
    } catch (error) {
      toast.error("Failed to update property. Please check the form for errors.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center mt-5">
        <h4>Property not found</h4>
        <Button variant="primary" onClick={() => navigate('/ownerdashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
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
          <Col md={6}>
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

          <Col md={6}>
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

        {/* Images */}
        <Form.Group className="mb-4">
          <Form.Label>Property Images <span className="text-danger">*</span></Form.Label>
          <div className="border border-dashed border-2 p-4 text-center rounded bg-light">
            <input 
              type="file" 
              id="file-upload" 
              className="d-none" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            <label htmlFor="file-upload" className="btn btn-outline-primary mb-2">
              <i className="fas fa-upload me-2"></i>
              Add More Images
            </label>
            <p className="text-muted small mb-0">
              Add additional images or replace existing ones<br/>
              Maximum 10 images total, 5MB each. Supported formats: JPG, PNG, GIF
            </p>
          </div>
          
          {/* Image Preview Grid */}
          {formData.previewUrls.length > 0 && (
            <div className="mt-3">
              <div className="row g-3">
                {formData.previewUrls.map((url: string, i: number) => (
                  <div key={i} className="col-md-3 col-sm-4 col-6">
                    <div className="position-relative">
                      <img 
                        src={url} 
                        alt={`Property image ${i + 1}`}
                        className="img-fluid rounded shadow-sm"
                        style={{
                          aspectRatio: '1',
                          objectFit: 'cover',
                          width: '100%',
                          height: '150px'
                        }}
                        onError={(e) => {
                          console.error(`Failed to load image: ${url}`);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = target.nextElementSibling as HTMLElement;
                          if (placeholder) {
                            placeholder.style.display = 'flex';
                          }
                        }}
                      />
                      <div 
                        className="d-none align-items-center justify-content-center bg-light rounded border"
                        style={{width: '100%', height: '150px', color: '#666'}}
                      >
                        <div className="text-center">
                          <i className="fas fa-image mb-2" style={{fontSize: '24px', opacity: 0.5}}></i>
                          <br />
                          <small>Image not available</small>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1"
                        onClick={() => handleRemoveImage(i)}
                        disabled={isSubmitting}
                        style={{width: '30px', height: '30px'}}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {validationErrors.images && (
            <div className="text-danger small mt-2">{validationErrors.images}</div>
          )}
          {errors?.images && (
            <div className="text-danger small mt-2">{errors.images[0]}</div>
          )}
        </Form.Group>

        <div className="d-flex gap-3">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting}
            className="px-4"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Updating...
              </>
            ) : (
              'Update Property'
            )}
          </Button>
          
          <Button 
            variant="secondary" 
            type="button" 
            onClick={() => navigate('/ownerdashboard')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </>
  );
};

export default EditProperty;