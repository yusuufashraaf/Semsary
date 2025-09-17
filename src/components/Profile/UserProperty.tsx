import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import './UserProperty.css';
import { fetchUserProperties } from '@services/axios-global';
import { Property } from '../../types';

interface UserPropertiesProps {
  userId: number;
}

const UserProperties: React.FC<UserPropertiesProps> = () => {
  const userId = 7; // Replace with actual user ID
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'forSale' | 'forRent'>('all');

  useEffect(() => {
    const getPropertiesData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProperties(userId);
        setProperties(data);
      } catch (err) {
        setError('Failed to fetch properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getPropertiesData();
  }, [userId]);

  const handleSave = (id: number, section: string) => {
    // Handle save/unsave functionality
    console.log(`Property ${id} saved/unsaved from section: ${section}`);
    // You would typically update the backend here
  };

  const formatPropertyForCard = (property: Property) => {
    return {
      id: property.id,
      address: `${property.location.address}, ${property.location.city}, ${property.location.state}`,
      price: `${formatCurrency(property.price)} ${property.price_type === 'Monthly' ? '/mo' : ''}`,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      saved: false, // You can implement actual saved state from your data
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      size: property.size
    };
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  const filteredProperties = properties.filter(property => {
    if (activeTab === 'forSale') return property.price_type === 'FullPay';
    if (activeTab === 'forRent') return property.price_type === 'Monthly';
    return true;
  });

  if (loading) {
    return (
      <div className="user-properties">
        <div className="loading">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-properties">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="user-properties">
      <div className="sidebar">
        <div className="brand">
          <h2>Urban Dwellings</h2>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li><a href="#"><i className="fas fa-shopping-bag"></i> Buy</a></li>
            <li><a href="#"><i className="fas fa-key"></i> Rent</a></li>
            <li><a href="#"><i className="fas fa-dollar-sign"></i> Sell</a></li>
            <li><a href="#"><i className="fas fa-home"></i> Manage Property</a></li>
          </ul>
        </nav>
        
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search" />
        </div>
      </div>
      
      <div className="main-content">
        <div className="content-header">
          <h1>My Properties</h1>
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Properties
            </button>
            <button 
              className={`tab ${activeTab === 'forSale' ? 'active' : ''}`}
              onClick={() => setActiveTab('forSale')}
            >
              For Sale
            </button>
            <button 
              className={`tab ${activeTab === 'forRent' ? 'active' : ''}`}
              onClick={() => setActiveTab('forRent')}
            >
              For Rent
            </button>
          </div>
        </div>

        <div className="properties-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-home"></i>
            </div>
            <div className="stat-info">
              <h3>{properties.length}</h3>
              <p>Total Properties</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-info">
              <h3>{properties.filter(p => p.price_type === 'FullPay').length}</h3>
              <p>For Sale</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-key"></i>
            </div>
            <div className="stat-info">
              <h3>{properties.filter(p => p.price_type === 'Monthly').length}</h3>
              <p>For Rent</p>
            </div>
          </div>
        </div>

        <div className="properties-list">
          {filteredProperties.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-home"></i>
              <h3>No properties found</h3>
              <p>
                {activeTab === 'forSale' 
                  ? 'You don\'t have any properties for sale.' 
                  : activeTab === 'forRent'
                  ? 'You don\'t have any properties for rent.'
                  : 'You haven\'t listed any properties yet.'
                }
              </p>
              <button className="explore-btn">
                List a Property
              </button>
            </div>
          ) : (
            filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={formatPropertyForCard(property)}
                onSave={handleSave}
                section="myProperties"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProperties;