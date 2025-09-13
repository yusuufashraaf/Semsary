import React from 'react';
import { Property } from '../../types';
import PropertyCard from './PropertyCard';
import './PropertyList.css'; // You'll need to create this CSS file

interface PropertyListProps {
  title: string;
  properties: Property[];
  onSave: (id: number, section: string) => void;
  section: string;
}

const PropertyList: React.FC<PropertyListProps> = ({ title, properties, onSave, section }) => {
  return (
    <div className="wishlist-section">
      <h2 className="section-title">{title}</h2>
      {properties.map(property => (
        <PropertyCard 
          key={property.id} 
          property={property} 
          onSave={onSave}
          section={section}
        />
      ))}
    </div>
  );
};

export default PropertyList;