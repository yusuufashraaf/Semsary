import { useState, useEffect } from 'react';
import PropertyCard from '@components/PropertyList/PropertCard';
import { fetchUserProperties } from '@services/axios-global';
import { Listing } from '../../types';
import { TFullUser } from 'src/types/users/users.types';
import { toast } from 'react-toastify';
import Loader from '@components/common/Loader/Loader';

const UserProperties = ({ user }: {user: TFullUser })=> {
  const [properties, setProperties] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'forSale' | 'forRent' | 'sold' | 'rented'>('all');
  const [savedProperties, setSavedProperties] = useState<number[]>([]);

  useEffect(() => {
    const getPropertiesData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProperties(user.id);
        setProperties(data);
      } catch (err) {
        setError('Failed to fetch properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getPropertiesData();
  }, [user.id]);

  const filteredProperties = properties.filter(property => {
    if (activeTab === 'forSale') return property.price_type === 'FullPay';
    if (activeTab === 'forRent') return (property.price_type === 'Monthly' || property.price_type === 'Daily');
    if (activeTab === 'sold') return property.property_state === 'sold';      
    if (activeTab === 'rented') return property.property_state === 'rented';  
    return true;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="loading"><Loader message='Loading properties...' /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  const toggleSavedProperty = (id: number) => {
    setSavedProperties((prev) => {
      const isSaved = prev.includes(id);
      const updated = isSaved ? prev.filter((i) => i !== id) : [...prev, id];

      // Toast feedback
      if (isSaved) toast.info("Removed from wishlist");
      else toast.success("Added to wishlist");

      return updated;
    });
  };

  return (
    <div className="container">
      <div className="content-header">
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
          <button 
            className={`tab ${activeTab === 'sold' ? 'active' : ''}`}
            onClick={() => setActiveTab('sold')}
          >
            Sold
          </button>
          <button 
            className={`tab ${activeTab === 'rented' ? 'active' : ''}`}
            onClick={() => setActiveTab('rented')}
          >
            Rented
          </button>
        </div>
      </div>

      <div className="list">
        {filteredProperties.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-home empty-state-icon"></i>
            <h3>No properties found</h3>
            <p>
              {activeTab === 'forSale' 
                ? 'You don\'t have any properties for sale.' 
                : activeTab === 'forRent'
                ? 'You don\'t have any properties for rent.'
                : activeTab === 'sold'
                ? 'You don\'t have any sold properties.'
                : activeTab === 'rented'
                ? 'You don\'t have any rented properties.'
                : 'You haven\'t listed any properties yet.'
              }
            </p>
          </div>
        ) : (
          filteredProperties.map(property => (
            <PropertyCard key={property.id}
              property={property}
              viewMode={"list"}
              savedProperties={savedProperties}
              toggleSavedProperty={toggleSavedProperty}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UserProperties;
