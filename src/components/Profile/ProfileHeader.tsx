import React from 'react';
import './ProfileHeader.css';

const ProfileHeader: React.FC = () => {
  return (
    <div className="profile-sidebar">
      

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4 className="nav-section-title">Navigation</h4>
          <a href='#' className="nav-link">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a href='#' className="nav-link">
            <i className="fas fa-shopping-bag"></i>
            <span>Buy</span>
          </a>
          <a href='#' className="nav-link">
            <i className="fas fa-key"></i>
            <span>Rent</span>
          </a>
          <a href='#' className="nav-link">
            <i className="fas fa-dollar-sign"></i>
            <span>Sell</span>
          </a>
          <a href='#' className="nav-link">
            <i className="fas fa-house-user"></i>
            <span>My Home</span>
          </a>
        </div>

        <div className="nav-section">
          <h4 className="nav-section-title">Account</h4>
          <a href='#' className="nav-link">
            <i className="fas fa-envelope"></i>
            <span>Messages</span>
            <span className="notification-badge">3</span>
          </a>
          <a href='#' className="nav-link">
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
            <span className="notification-badge">12</span>
          </a>
          <a href='#' className="nav-link active">
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </a>
        </div>
      </nav>

    </div>
  );
};

export default ProfileHeader;