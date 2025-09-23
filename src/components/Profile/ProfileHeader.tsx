import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import '../../styles/themes.css';
import './ProfileHeader.css';
import { TFullUser } from 'src/types/users/users.types';

type ProfileHeaderProps = {
  section: string;
  user: TFullUser | null; 
  unreadCount: number;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, unreadCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getSectionTitle = (section: string) => {
    const titles: { [key: string]: string } = {
      userInfo: 'Your Info',
      properties: 'My Properties',
      'owner-dashboard': 'Dashboard',
      reviews: 'Reviews & Ratings',
      purchases: 'Purchase History',
      wishlist: 'My Wishlist',
      notifications: 'Notifications',
      ownerNotification: 'Notifications',
      rentRequests: 'Requests',
      changePhone: 'Change Phone Number',
      changeEmail: 'Change Email Address',
      changePassword: 'Change Password'
    };
    return titles[section] || 'Profile';
  };

  const handleNavigation = (path: string) => {
    navigate(`/profile/${path}`);
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const role = user?.role?.toLowerCase();

  const SidebarContent = () => (
    <div className="sidebar-content">
      {/* Main Navigation Section */}
      <div className="nav-section">
        <h4 className="section-heading">
          <i className="fas fa-compass section-icon"></i>
          Navigation
        </h4>
        <div className="nav-links">
          <button 
            onClick={() => handleNavigation('home')}
            className={`nav-link ${isActive('home') ? 'active' : ''}`}
          >
            <i className="fas fa-home nav-icon"></i>
            <span>Your Info</span>
          </button>         
          {/* {role === 'owner' && ( */}
            {/* <> */}
            <button
              onClick={() => handleNavigation('owner-dashboard')}
              className={`nav-link ${isActive('owner-dashboard') ? 'active' : ''}`}
            >
              <i className="fas fa-tachometer-alt nav-icon"></i>
              <span>Dashboard</span>
            </button>
          <button 
            onClick={() => handleNavigation('rentRequests')}
            className={`nav-link ${isActive('rentRequests') ? 'active' : ''}`}
          >
            <i className="fas fa-envelope-open-text nav-icon"></i>
            <span>Requests</span>
          </button>

          <button 
            onClick={() => handleNavigation('notifications')}
            className={`nav-link ${isActive('notifications') ? 'active' : ''}`}
          >
            <i className="fas fa-bell nav-icon"></i>
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          {/* </> */}
          {/* )} */}
          
          <button 
            onClick={() => handleNavigation('reviews')}
            className={`nav-link ${isActive('reviews') ? 'active' : ''}`}
          >
            <i className="fas fa-star nav-icon"></i>
            <span>Reviews</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('purchases')}
            className={`nav-link ${isActive('purchases') ? 'active' : ''}`}
          >
            <i className="fas fa-shopping-cart nav-icon"></i>
            <span>Purchases</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('wishlist')}
            className={`nav-link ${isActive('wishlist') ? 'active' : ''}`}
          >
            <i className="fas fa-heart nav-icon"></i>
            <span>Wishlist</span>
          </button>
        </div>
      </div>

      {/* Account Management Section */}
      <div className="nav-section">
        <h4 className="section-heading">
          <i className="fas fa-cog section-icon"></i>
          Account Settings
        </h4>
        <div className="nav-links">
              <button 
                onClick={() => handleNavigation('messages')}
                className={`nav-link ${isActive('messages') ? 'active' : ''}`}
              >
                <i className="fas fa-bell nav-icon"></i>
                <span>Messages</span>
              </button>

          <button 
            onClick={() => handleNavigation('changePhone')}
            className={`nav-link ${isActive('changePhone') ? 'active' : ''}`}
          >
            <i className="fas fa-phone nav-icon"></i>
            <span>Change Phone</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('changeEmail')}
            className={`nav-link ${isActive('changeEmail') ? 'active' : ''}`}
          >
            <i className="fas fa-envelope nav-icon"></i>
            <span>Change Email</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('changePassword')}
            className={`nav-link ${isActive('changePassword') ? 'active' : ''}`}
          >
            <i className="fas fa-lock nav-icon"></i>
            <span>Change Password</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-wrapper">
    <div className="profile-layout">
        {/* Collapsible Sidebar */}
        <Collapse in={sidebarOpen} dimension="width">
          <div className="profile-sidebar">
            <SidebarContent />
          </div>
        </Collapse>

        {/* Main Content Area */}
        <div className={`profile-content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
          {/* Content will be rendered here by the parent component */}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;