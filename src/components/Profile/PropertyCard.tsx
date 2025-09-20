import React from 'react';
import { Property } from '../../types';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
  onSave: (id: number, section: string) => void;
  section: string;
  saved?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSave, section, saved = false }) => {
  return (
    <div className="property-card">
      <div className="property-image">
        <img 
          src={property.images?.[0] || 'fallback-url'} 
          alt={property.address}
          className="property-img"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            e.currentTarget.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80';
          }}
        />
        <div className="property-image-overlay">
          <button className="favorite-btn" onClick={() => onSave(parseInt(property.id), section)}>
            <i className={`fas fa-heart ${saved ? 'saved' : ''}`}></i>
          </button>
        </div>
      </div>
      <div className="property-info">
        <h3 className="property-address">{property.address}</h3>
        <p className="property-price">{property.price}</p>
        <div className="property-details">
          <span className="property-bed"><i className="fas fa-bed"></i> 3 beds</span>
          <span className="property-bath"><i className="fas fa-bath"></i> 2 baths</span>
          <span className="property-size"><i className="fas fa-ruler-combined"></i> 1,800 sqft</span>
        </div>
        <div className="property-actions">
          <button className="btn btn-primary">View Details</button>
          <button 
            className={`btn ${saved && section === 'recentlyViewed' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onSave(parseInt(property.id), section)}
          >
            {section === 'recentlyViewed' ? (saved ? 'Saved' : 'Save') : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;