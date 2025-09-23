import UserNotifications from '@components/Profile/UserNotifications';
import UserReviews from '@components/Profile/UserReviews';
import { useEffect, useState } from 'react';
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
import { useAppSelector } from '@store/hook';
import UserMessages from '@components/Profile/UserMessages';
import UserMessagesOrigin from '@components/Profile/UserMessagesOrigin';

const Profile = () => {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.Authslice);
  const [unreadCount, setUnreadCount] = useState(0);
// Redirect to login if user is null
  useEffect(() => {
    if (user === null) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);
    
  useEffect(() => {
  const validSections = ['home','owner-dashboard' ,'reviews', 
    'notifications', 'rentRequests' , 'account', 'purchases', 'wishlist', 'changeEmail', 'changePhone', 'changePassword', 'messages'];
  
  if (!section || !validSections.includes(section)) {
    navigate('/profile/home', { replace: true });
  }
}, [section, navigate]); // Add dependencies

  const renderSection = () => {
    if (!user) return null; 
  switch (section) {
    case 'home':
      return <BasicInfo />;
      case 'reviews':
        return <UserReviews user={user} />;
      case 'notifications':
        return <UserNotifications user={user} onUnreadCountChange={setUnreadCount}/>;
      case 'rentRequests':
        return <RentRequests userId={user.id}/>;
      case 'purchases':
        return <UserPurchases user={user} />;
      case 'wishlist':
        return <UserWishlist user={user} />;
    case 'messages':
      return <UserMessagesOrigin />;
    case 'changeEmail':
      return <ChangeEmail />;
    case 'changePhone':
      return <ChangePhone />;
    case 'changePassword':
      return <ChangePassword />;
    case 'owner-dashboard':
      return <OwnerDashboard />;
    default:
        return <BasicInfo />;
  }
};


return (
<div className="profile-container">
  <ProfileHeader section={section || 'home'} user={user} unreadCount={unreadCount}/>
  {renderSection()}
</div>
);
};

export default Profile;