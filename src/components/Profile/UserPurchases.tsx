import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate from React Router
import { fetchUserPurchases, fetchUserBookings } from '@services/axios-global';
import { TFullUser } from 'src/types/users/users.types';
import Loader from '@components/common/Loader/Loader';
import { useAppSelector } from '@store/hook';
import { PurchaseResponse } from '@app-types/index';

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

const UserPurchases = ()=> {
  const navigate = useNavigate(); // Use useNavigate instead of useRouter
  const [activeTab, setActiveTab] = useState<TabType>('purchases');
  const [purchases, setPurchases] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {jwt, user} = useAppSelector(state => state.Authslice);

  useEffect(() => {
    const getPurchasesData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserPurchases(user?.id || 1);
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
        const data = await fetchUserBookings(user?.id || 1);
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

  // Function to handle property click
  const handlePropertyClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  // Function to handle "View details" button click
  const handleViewDetailsClick = (e: React.MouseEvent, propertyId: number) => {
    e.stopPropagation(); // Prevent the card click event from firing
    navigate(`/property/${propertyId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string, currency: string = 'EGP') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(parseFloat(amount));
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading"><Loader message='Loading...' /></div>
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

  return (
    <div className="container">
      <div className="content-header">
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
          <h2 className="heading-secondary">Past purchases</h2>
          <div className="list">
            {purchases.length > 0 ? (
              purchases.map(purchase => (
                <div 
                  key={purchase.id} 
                  className="card card-hover"
                  onClick={() => handlePropertyClick(purchase.property.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="purchase-header">
                    <span className="order-date">
                      Order placed on {formatDate(purchase.created_at)}
                    </span>
                    <span className={`status-badge ${purchase.status}`}>
                      {purchase.status}
                    </span>
                  </div>
                  
                  <h3 className="heading-tertiary">
                    {purchase.property.title}
                  </h3>
                  
                  <p className="seller-info">
                    {purchase.property.location.address}, {purchase.property.location.city}, {purchase.property.location.state}
                  </p>
                  
                  <div className="property-details">
                    <span>{purchase.property.type}</span>
                    <span>•</span>
                    <span>{purchase.property.bedrooms} beds</span>
                    <span>•</span>
                    <span>{purchase.property.bathrooms} baths</span>
                    <span>•</span>
                    <span>{purchase.property.size} sq ft</span>
                  </div>
                  
                  <div className="property-actions">
                    <span className="property-price">
                      {formatCurrency(purchase.amount)}
                    </span>
                    <span>
                      Paid via {purchase.payment_gateway}
                    </span>
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={(e) => handleViewDetailsClick(e, purchase.property.id)}
                  >
                    View details
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="fas fa-shopping-bag empty-state-icon"></i>
                <h3>No purchases yet</h3>
                <p>You haven't made any purchases yet. Start exploring properties to find your perfect home.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bookings-section">
          <h2 className="heading-secondary">Upcoming bookings</h2>
          <div className="list">
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <div 
                  key={booking.id} 
                  className="card card-hover"
                  onClick={() => handlePropertyClick(booking.property.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="booking-header">
                    <span className="booking-dates">
                      {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                    </span>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <h3 className="heading-tertiary">
                    {booking.property.title}
                  </h3>
                  
                  <p className="seller-info">
                    {booking.property.location.address}, {booking.property.location.city}, {booking.property.location.state}
                  </p>
                  
                  <div className="property-details">
                    <span>{booking.property.type}</span>
                    <span>•</span>
                    <span>{booking.property.bedrooms} beds</span>
                    <span>•</span>
                    <span>{booking.property.bathrooms} baths</span>
                    <span>•</span>
                    <span>{booking.property.size} sq ft</span>
                  </div>
                  
                  <div className="property-actions">
                    <span className="property-price">
                      {formatCurrency(booking.property.price)}
                    </span>
                    <span>
                      {booking.property.price_type}
                    </span>
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={(e) => handleViewDetailsClick(e, booking.property.id)}
                  >
                    View details
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="fas fa-calendar-times empty-state-icon"></i>
                <h3>No upcoming bookings</h3>
                <p>You don't have any upcoming bookings. Explore properties and book your next stay.</p>
                <button className="btn btn-primary">
                  Explore properties
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPurchases;