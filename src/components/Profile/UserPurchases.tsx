import React, { useState } from 'react';
import './UserPurchases.css';

type TabType = 'purchases' | 'bookings';

interface Purchase {
  id: number;
  orderDate: string;
  address: string;
  seller: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface Booking {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  address: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const UserPurchases: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('purchases');

  const purchases: Purchase[] = [
    {
      id: 1,
      orderDate: 'Jan 15, 2024',
      address: '123 Oak Street, Unit 4B',
      seller: 'Sarah Miller',
      status: 'completed'
    },
    {
      id: 2,
      orderDate: 'Dec 20, 2023',
      address: '456 Pine Avenue, House 22',
      seller: 'David Lee',
      status: 'completed'
    }
  ];

  const bookings: Booking[] = [
    // No upcoming bookings
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

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
                  <div key={purchase.id} className="purchase-card">
                    <div className="purchase-header">
                      <span className="order-date">Order placed on {purchase.orderDate}</span>
                      <span className={`status-badge ${purchase.status}`}>
                        {purchase.status}
                      </span>
                    </div>
                    <div className="purchase-details">
                      <h3 className="property-address">{purchase.address}</h3>
                      <p className="seller-info">Sold by: {purchase.seller}</p>
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
                        {booking.checkInDate} - {booking.checkOutDate}
                      </span>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-details">
                      <h3 className="property-address">{booking.address}</h3>
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