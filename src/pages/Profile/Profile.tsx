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

import OwnerDashboard from '@components/owner/OwnerDashboard';
import { useAppSelector } from '@store/hook';
import { TFullUser } from 'src/types/users/users.types';

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
    
  useEffect(() => {
  const validSections = ['home', 'properties','owner-dashboard' ,'reviews', 'notifications', 'account', 'purchases', 'wishlist', 'changeEmail', 'changePhone', 'changePassword'];
  
  if (!section || !validSections.includes(section)) {
    navigate('/profile/home', { replace: true });
  }
}, [section, navigate]); // Add dependencies

  const renderSection = () => {
  switch (section) {
    case 'home':
      return <BasicInfo />;
    case 'properties':
      return <UserProperties />;
    case 'reviews':
      return <UserReviews />;
    case 'notifications':
      return <UserNotifications />;
    case 'account':
      return <UserAccount />;
    case 'purchases':
      return <UserPurchases/>;
    case 'wishlist':
      return <UserWishlist />;
    // case 'basicInfo':
    //   return <BasicInfo />;
    case 'changeEmail':
      return <ChangeEmail />;
    case 'changePhone':
      return <ChangePhone />;
    case 'changePassword':
      return <ChangePassword />;
    case 'owner-dashboard':
      return <OwnerDashboard />;
    default:
      return <HomeFinderPage />;
  }
};
renderSection();

return (
<div className="profile-container">
  <ProfileHeader section={String(section)}/>
  {renderSection()}
</div>
);


  // Validate section and redirect if invalid
  useEffect(() => {
    const validSections = ['home', 'properties', 'reviews', 'notifications', 'purchases', 'wishlist', 'changeEmail', 'changePhone', 'changePassword'];
    
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