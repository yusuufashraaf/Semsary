import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createProperty } from "../../store/Owner/ownerDashboardSlice";
import { AppDispatch, RootState } from "../../store";
import LocationMap from "@components/PropertyDetails/LocationMap";


const AddPropertyForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { errors } = useSelector((state: RootState) => state.ownerDashboard);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Apartment");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("FullPay");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [size, setSize] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [features, setFeatures] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/features")
      .then((res) => res.json())
      .then((data) => setFeatures(data.data))
      .catch((err) => console.error(err));
  }, []);

  const handleFeatureToggle = (featureId: number) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  // search location
  const handleSearch = async (value: string) => {
    setQuery(value);

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
    setQuery(place.display_name);
    setResults([]);
    setSelectedLocation({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      address: place.display_name,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert("Please select a location");
      return;
    }

    const propertyData = {
      title,
      description,
      type,
      price: Number(price),
      price_type: priceType,
      location: {
        address: selectedLocation.address,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      },
      size: Number(size),
      features: selectedFeatures,
    };
    dispatch(createProperty(propertyData));
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Title */}
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          className={errors.title ? "is-invalid" : ""}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter property title"
          required
        />
        {errors.title && <div className="invalid-feedback">{errors.title[0]}</div>}
      </Form.Group>

      {/* Description */}
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          className={errors.description ? "is-invalid" : ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter property description"
          required
        />
        {errors.description && (
          <div className="invalid-feedback">{errors.description[0]}</div>
        )}
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={type}
              className={errors.type ? "is-invalid" : ""}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Apartment</option>
              <option>Villa</option>
              <option>Duplex</option>
              <option>Roof</option>
              <option>Land</option>
            </Form.Select>
            {errors.type && <div className="invalid-feedback">{errors.type[0]}</div>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Size (sq ft)</Form.Label>
            <Form.Control
              type="number"
              value={size}
              className={errors.size ? "is-invalid" : ""}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Enter property size"
              required
            />
            {errors.size && <div className="invalid-feedback">{errors.size[0]}</div>}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              className={errors.price ? "is-invalid" : ""}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              required
            />
            {errors.price && <div className="invalid-feedback">{errors.price[0]}</div>}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Price Type</Form.Label>
            <Form.Select
              value={priceType}
              className={errors.price_type ? "is-invalid" : ""}
              onChange={(e) => setPriceType(e.target.value)}
            >
              <option>FullPay</option>
              <option>Monthly</option>
              <option>Daily</option>
            </Form.Select>
            {errors.price_type && (
              <div className="invalid-feedback">{errors.price_type[0]}</div>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Location */}
      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="ابحث عن موقع..."
          required
        />
        {results.length > 0 && (
          <ul className="border mt-2 max-h-60 overflow-y-auto rounded bg-white shadow">
            {results.map((place) => (
              <li
                key={place.place_id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelect(place)}
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
        {errors.location && (
          <div className="invalid-feedback d-block">{errors.location[0]}</div>
        )}
      </Form.Group>
        <LocationMap
          lat={selectedLocation ? selectedLocation.lat : 0}
          lng={selectedLocation ? selectedLocation.lng : 0}
          height={320}
        />

      {/* Features */}
      <Form.Group className="mb-3">
        <Form.Label>Features</Form.Label>
        <Row>
          {features.map((feature) => (
            <Col md={4} key={feature.id}>
              <Form.Check
                type="checkbox"
                id={`feature-${feature.id}`}
                label={feature.name}
                checked={selectedFeatures.includes(feature.id)}
                onChange={() => handleFeatureToggle(feature.id)}
              />
            </Col>
          ))}
        </Row>
        {errors.features && (
          <div className="text-danger">{errors.features[0]}</div>
        )}
      </Form.Group>

      <Button variant="success" type="submit">
        Save Property
      </Button>
    </Form>
  );
};

export default AddPropertyForm;
