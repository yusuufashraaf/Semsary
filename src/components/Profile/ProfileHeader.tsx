import React from 'react';
import '../../styles/themes.css';
//import './profile-components.css';


interface ProfileHeaderProps {
  section: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ section }) => {
  return (
    <div className="card">
      <div>
        <h2 className="heading-secondary text-capitalize">{section} page</h2>
      </div>
      <div className="sidebar-nav">
        <div className="nav-section">
          <h4 className="heading-tertiary">Navigation</h4>
          <a href='home' className="btn btn-secondary">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a href='properties' className="btn btn-secondary">
            <i className="fas fa-shopping-bag"></i>
            <span>Properties</span>
          </a>
          <a href='reviews' className="btn btn-secondary">
            <i className="fas fa-key"></i>
            <span>Reviews</span>
          </a>
          <a href='purchases' className="btn btn-secondary">
            <i className="fas fa-house-user"></i>
            <span>Purchases</span>
          </a>
          <a href='wishlist' className="btn btn-secondary">
            <i className="fas fa-house-user"></i>
            <span>Wishlist</span>
          </a>
        </div>

        <div className="nav-section">
          <h4 className="heading-tertiary">Account</h4>
          <a href='#' className="btn btn-secondary">
            <i className="fas fa-envelope"></i>
            <span>Messages</span>
            <span className="notification-badge">3</span>
          </a>
          <a href='notifications' className="btn btn-secondary">
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
            <span className="notification-badge">12</span>
          </a>
          <a href='account' className="btn btn-primary">
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
};


export default ProfileHeader;