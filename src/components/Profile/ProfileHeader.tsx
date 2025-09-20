import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/themes.css';
import './ProfileHeader.css';
import { TFullUser } from 'src/types/users/users.types';
import { useAppSelector } from "@store/hook";

interface ProfileHeaderProps {
  section: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ section, user }: { section: string|undefined, user: TFullUser }) => {
  const user = useAppSelector((state) => state.Authslice.user);
  const navigate = useNavigate();
  const location = useLocation();


  const handleNavigation = (path: string) => {
    navigate(`/profile/${path}`);
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const getSectionTitle = (section: string) => {
    const titles: { [key: string]: string } = {
      userInfo: 'Your Info',
      properties: 'My Properties',
      ownerdashboard: 'Dashboard',
      reviews: 'Reviews & Ratings',
      purchases: 'Purchase History',
      wishlist: 'My Wishlist',
      notifications: 'Notifications',
      changePhone: 'Change Phone Number',
      changeEmail: 'Change Email Address',
      changePassword: 'Change Password'
    };
    return titles[section] || 'Profile';
  };
console.log("USER ROLE:", user?.role);
const role = user?.role?.toLowerCase();
  return (
    <div className="profile-layout container-fluid">
      <div>
        <h6 className="text-center text-capitalize">Welcome {user.first_name}</h6>
      </div>
      {/* Navigation Sidebar */}
      <div className="profile-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">{getSectionTitle(section)}</h2>
          <p className="sidebar-subtitle">Manage your account</p>
        </div>
        
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
              
              {/* make this active when user's role is user */}
              {role === 'user' && (
              <button 
                onClick={() => handleNavigation('properties')}
                className={`nav-link ${isActive('properties') ? 'active' : ''}`}
              >
                <i className="fas fa-building nav-icon"></i>
                <span>Properties</span>
              </button>
              )}
              {role === 'owner' && (
              <button
                onClick={() => handleNavigation('owner-dashboard')}
                className={`nav-link ${isActive('ownerdashboard') ? 'active' : ''}`}
              >
                <i className="fas fa-tachometer-alt nav-icon"></i>
                <span>Dashboard</span>
              </button>
              )}
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
                onClick={() => handleNavigation('notifications')}
                className={`nav-link ${isActive('notifications') ? 'active' : ''}`}
              >
                <i className="fas fa-bell nav-icon"></i>
                <span>Notifications</span>
                <span className="notification-badge">12</span>
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

          {/* Quick Actions Section */}
          <div className="nav-section">
            <h4 className="section-heading">
              <i className="fas fa-bolt section-icon"></i>
              Quick Actions
            </h4>
            <div className="nav-links">
              <button className="nav-link action-link">
                <i className="fas fa-plus nav-icon"></i>
                <span>Add Property</span>
              </button>
              
              <button className="nav-link action-link">
                <i className="fas fa-download nav-icon"></i>
                <span>Export Data</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;