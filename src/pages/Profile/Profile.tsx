import UserNotifications from '@components/Profile/UserNotifications';
import UserProperties from '@components/Profile/UserProperties';
import UserReviews from '@components/Profile/UserReviews';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserPurchases from '@components/Profile/UserPurchases';
import ProfileHeader from '@components/Profile/ProfileHeader';
import UserWishlist from '@components/Profile/UserWishlists';
import BasicInfo from '@components/User/BasicInfo/BasicInfo';
import ChangeEmail from '@components/User/ChangeEmail/ChangeEmail';
import ChangePhone from '@components/User/ChangePhone/ChangePhone';
import ChangePassword from '@components/User/ChangePassword/ChangePassword';
import { useAppSelector } from '@store/hook';
import { TFullUser } from 'src/types/users/users.types';
import UserMessages from '@components/Profile/UserMessages';

const Profile = () => {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector(state => state.Authslice);
  
  // Redirect to login if user is null
  useEffect(() => {
    if (user === null) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Validate section and redirect if invalid
  useEffect(() => {
    const validSections = ['','home', 'properties', 'reviews', 'notifications', 'purchases', 'wishlist', 'changeEmail', 'changePhone', 'changePassword', 'messages'];
    
    if (!section || !validSections.includes(section)) {
      navigate('/profile/home', { replace: true });
    }
  }, [section, navigate]);


  const renderSection = (user: TFullUser) => {
    switch (section) {
      case 'home':
        return <BasicInfo />;
      case 'properties':
        return <UserProperties user={user} />;
      case 'reviews':
        return <UserReviews user={user} />;
      case 'notifications':
        return <UserNotifications user={user} />;
      case 'purchases':
        return <UserPurchases user={user} />;
      case 'wishlist':
        return <UserWishlist user={user} />;
        case 'messages':
      return <UserMessages user={user} />;
      case 'changeEmail':
        return <ChangeEmail />;
      case 'changePhone':
        return <ChangePhone />;
      case 'changePassword':
        return <ChangePassword />;
      default:
        return <BasicInfo />;
    }
  };

  return (
    <div className="profile-container">
      <ProfileHeader section={section || 'home'} user={user} />
      {renderSection(user)}
    </div>
  );
};

export default Profile;