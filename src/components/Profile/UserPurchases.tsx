import React, { useEffect, useState } from 'react';
import './UserPurchases.css';
import { fetchUserPurchases, fetchUserBookings } from '@services/axios-global';

type TabType = 'purchases' | 'bookings';

interface PaymentDetails {
  payment_method: string;
  card_last_four: number;
  currency: string;
}

interface PropertyLocation {
  city: string;
  state: string;
  zip_code: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface Property {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  type: string;
  price: string;
  price_type: string;
  location: PropertyLocation;
  size: number;
  property_state: string;
  bedrooms: number;
  bathrooms: number;
  created_at: string;
  updated_at: string;
}

interface Purchase {
  purchase_id: number;
  user_id: number;
  property_id: number;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  amount: string;
  deposit_amount: string;
  payment_gateway: string;
  transaction_id: string;
  payment_details: PaymentDetails;
  created_at: string;
  updated_at: string;
  property: Property;
}

interface Booking {
  id: number;
  property_id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  total_price: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
  updated_at: string;
  property: Property;
}

const UserPurchases: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('purchases');
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPurchasesData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserPurchases(7);
        setPurchases(data);
      } catch (err) {
        setError('Failed to fetch purchases');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const getBookingsData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserBookings(7);
        setBookings(data);
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getBookingsData();
    getPurchasesData();
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(parseFloat(amount));
  };

  if (loading) {
    return (
      <div className="purchases-bookings">
        <div className="main-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="purchases-bookings">
        <div className="main-content">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="purchases-bookings">
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
          <h1>Purchases and bookings</h1>
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'purchases' ? 'active' : ''}`}
              onClick={() => handleTabChange('purchases')}
            >
              Purchases
            </button>
            <button 
              className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => handleTabChange('bookings')}
            >
              Bookings
            </button>
          </div>
        </div>
        
        {activeTab === 'purchases' ? (
          <div className="purchases-section">
            <h2>Past purchases</h2>
            <div className="purchases-list">
              {purchases.length > 0 ? (
                purchases.map(purchase => (
                  <div key={purchase.purchase_id} className="purchase-card">
                    <div className="purchase-header">
                      <span className="order-date">
                        Order placed on {formatDate(purchase.created_at)}
                      </span>
                      <span className={`status-badge ${purchase.status}`}>
                        {purchase.status}
                      </span>
                    </div>
                    
                    <h3 className="property-address">
                      {purchase.property.title}
                    </h3>
                    
                    <p className="seller-info">
                      {purchase.property.location.address}, {purchase.property.location.city}, {purchase.property.location.state}
                    </p>
                    
                    <div className="property-details" style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '16px',
                      fontSize: '14px',
                      color: '#67758d'
                    }}>
                      <span>{purchase.property.type}</span>
                      <span>•</span>
                      <span>{purchase.property.bedrooms} beds</span>
                      <span>•</span>
                      <span>{purchase.property.bathrooms} baths</span>
                      <span>•</span>
                      <span>{purchase.property.size} sq ft</span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#28a745'
                      }}>
                        {formatCurrency(purchase.amount, purchase.payment_details.currency)}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: '#67758d'
                      }}>
                        Paid via {purchase.payment_gateway}
                      </span>
                    </div>
                    
                    <button className="view-details-btn">
                      View details
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-shopping-bag"></i>
                  <h3>No purchases yet</h3>
                  <p>You haven't made any purchases yet. Start exploring properties to find your perfect home.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bookings-section">
            <h2>Upcoming bookings</h2>
            <div className="bookings-list">
              {bookings.length > 0 ? (
                bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <span className="booking-dates">
                        {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                      </span>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <h3 className="property-address">
                      {booking.property.title}
                    </h3>
                    
                    <p className="seller-info">
                      {booking.property.location.address}, {booking.property.location.city}, {booking.property.location.state}
                    </p>
                    
                    <div className="property-details" style={{
                      display: 'flex',
                      gap: '12px',
                      marginBottom: '16px',
                      fontSize: '14px',
                      color: '#67758d'
                    }}>
                      <span>{booking.property.type}</span>
                      <span>•</span>
                      <span>{booking.property.bedrooms} beds</span>
                      <span>•</span>
                      <span>{booking.property.bathrooms} baths</span>
                      <span>•</span>
                      <span>{booking.property.size} sq ft</span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#28a745'
                      }}>
                        {formatCurrency(booking.total_price)}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: '#67758d'
                      }}>
                        {booking.property.price_type}
                      </span>
                    </div>
                    
                    <button className="view-details-btn">
                      View details
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-calendar-times"></i>
                  <h3>No upcoming bookings</h3>
                  <p>You don't have any upcoming bookings. Explore properties and book your next stay.</p>
                  <button className="explore-btn">
                    Explore properties
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPurchases;