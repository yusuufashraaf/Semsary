import React, { useState } from 'react';
import { UserData, AccountTab } from '../../types';
import './UserAccount.css';

const UserAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AccountTab>('personal');
  const [userData, setUserData] = useState<UserData>({
    fullName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main Street, Anytown, CA 12345'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Handle form submission to your backend
    alert('Information updated successfully!');
  };

  const handleTabChange = (tab: AccountTab): void => {
    setActiveTab(tab);
  };

  const handleChangePassword = (): void => {
    // Implement password change logic
    alert('Password change functionality would be implemented here');
  };

  const handleDeleteAccount = (): void => {
    // Implement account deletion logic
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion functionality would be implemented here');
    }
  };

  return (
    
    <div className="user-account">
      <div className="account-sidebar">
        <nav className="account-nav">
          <h4>Account Settings</h4>
          <ul>
            <li className={activeTab === 'personal' ? 'active' : ''} onClick={() => handleTabChange('personal')}>
              <i className="fas fa-user"></i> Personal Information
            </li>
            <li className={activeTab === 'kyc' ? 'active' : ''} onClick={() => handleTabChange('kyc')}>
              <i className="fas fa-id-card"></i> KYC Status
            </li>
            <li className={activeTab === 'security' ? 'active' : ''} onClick={() => handleTabChange('security')}>
              <i className="fas fa-shield-alt"></i> Security
            </li>
            <li className={activeTab === 'actions' ? 'active' : ''} onClick={() => handleTabChange('actions')}>
              <i className="fas fa-cog"></i> Account Actions
            </li>
          </ul>
        </nav>
      </div>
      
      <div className="account-content">
        {activeTab === 'personal' && (
          <div className="tab-content">
            <h2>Personal Information</h2>
            <form onSubmit={handleSubmit} className="personal-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <button type="submit" className="update-btn">Update Information</button>
            </form>
          </div>
        )}
        
        {activeTab === 'kyc' && (
          <div className="tab-content">
            <h2>KYC Status</h2>
            <div className="kyc-status">
              <div className="verification-badge">
                <i className="fas fa-check-circle"></i>
                <h3>Identity Verification</h3>
                <span className="status verified">Verified</span>
              </div>
              <p>Your identity has been successfully verified. You can now access all features of Urban Dwellings.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="tab-content">
            <h2>Security</h2>
            <div className="security-options">
              <div className="security-item">
                <h3>Change Password</h3>
                <p>Update your password regularly to keep your account secure.</p>
                <button className="security-btn" onClick={handleChangePassword}>Change Password</button>
              </div>
              
              <div className="security-item">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account.</p>
                <button className="security-btn">Enable 2FA</button>
              </div>
              
              <div className="security-item">
                <h3>Login Activity</h3>
                <p>Review your recent login activity and devices.</p>
                <button className="security-btn">View Activity</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'actions' && (
          <div className="tab-content">
            <h2>Account Actions</h2>
            <div className="account-actions">
              <div className="action-item">
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
              </div>
              
              <div className="action-item">
                <h3>Download Data</h3>
                <p>Download a copy of all your personal data stored with Urban Dwellings.</p>
                <button className="download-btn">Request Data</button>
              </div>
              
              <div className="action-item">
                <h3>Deactivate Account</h3>
                <p>Temporarily deactivate your account. You can reactivate it later by logging in.</p>
                <button className="deactivate-btn">Deactivate Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;