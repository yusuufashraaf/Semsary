import UserNotifications from '@components/Profile/UserNotifications';
import UserReviews from '@components/Profile/UserReviews';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserPurchases from '@components/Profile/UserPurchases';
import ProfileHeader from '@components/Profile/ProfileHeader';
import UserWishlist from '@components/Profile/UserWishlists';
import BasicInfo from '@components/User/BasicInfo/BasicInfo';
import ChangeEmail from '@components/User/ChangeEmail/ChangeEmail';
import ChangePhone from '@components/User/ChangePhone/ChangePhone';
import ChangePassword from '@components/User/ChangePassword/ChangePassword';
import OwnerDashboard from '@components/owner/OwnerDashboard';
import RentRequests from '@components/owner/RentRequests';
import { useAppSelector, useAppDispatch } from '@store/hook';
import UserMessages from '@components/Profile/UserMessages';
import UserMessagesOrigin from '@components/Profile/UserMessagesOrigin';
import UserTest from '@components/Profile/UserTest';

const Profile = () => {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.Authslice);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Redirect to login if user is null
  useEffect(() => {
    if (user === null) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Validate section and redirect if invalid
  useEffect(() => {
  const validSections = ['home','owner-dashboard' ,'reviews', 
    'notifications', 'rentRequests' , 'account', 'purchases', 'wishlist', 'changeEmail', 'changePhone', 'changePassword', 'messages','Test'];
  
  if (!section || !validSections.includes(section)) {
    navigate('/profile/home', { replace: true });
  }
}, [section, navigate]); // Add dependencies

  const renderSection = () => {
    if (!user) return null;

    const componentKey = `${section}-${refreshKey}-${user.id}`;

    switch (section) {
      case 'home':
        return <BasicInfo key={componentKey} />;
      
      case 'reviews':
        return <UserReviews key={componentKey} user={user} />;
      
      case 'notifications':
        return (
          <UserNotifications 
            key={componentKey}
            user={user} 
            onUnreadCountChange={handleUnreadCountChange} 
          />
        );
      
      case 'rentRequests':
        return <RentRequests key={componentKey} userId={user.id} />;
      
      case 'purchases':
        return <UserPurchases key={componentKey} />;
      
      case 'wishlist':
        return <UserWishlist key={componentKey} user={user} />;
      
      case 'messages':
        return <UserMessagesOrigin key={componentKey} />;
      
      case 'changeEmail':
        return <ChangeEmail key={componentKey} />;
      
      case 'changePhone':
        return <ChangePhone key={componentKey} />;
      
      case 'changePassword':
        return <ChangePassword key={componentKey} />;
      
      case 'owner-dashboard':
        return <OwnerDashboard key={componentKey} />;
      case 'Test':
        return <UserTest />;
      
      default:
        return <BasicInfo key={componentKey} />;
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ProfileHeader 
        section={section || 'home'} 
        user={user} 
        unreadCount={unreadCount}
      />
      {renderSection()}
    </div>
  );
};

export default Profile;