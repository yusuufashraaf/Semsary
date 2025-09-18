
import HomeFinderPage from '@components/Profile/UserHome';
import UserNotifications from '@components/Profile/UserNotifications';
import UserProperties from '@components/Profile/UserProperties';
import UserReviews from '@components/Profile/UserReviews';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserAccount from '@components/Profile/UserAccount';
import UserPurchases from '@components/Profile/UserPurchases';
import ProfileHeader from '@components/Profile/ProfileHeader';
import UserWishlist from '@components/Profile/UserWishlists';


const Profile = () => {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();

  useEffect(() => {
  const validSections = ['home', 'properties', 'reviews', 'notifications', 'account', 'purchases', 'wishlist'];
  
  if (!section || !validSections.includes(section)) {
    navigate('/profile/home', { replace: true });
  }
}, [section, navigate]); // Add dependencies

  const renderSection = () => {
  switch (section) {
    case 'home':
      return <HomeFinderPage />;
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
    default:
      return <HomeFinderPage />;
  }
};
renderSection();

return (
<div className="profile-container">
  <ProfileHeader section={section}/>
  {renderSection()}
</div>
);

}

// Helper function



export default Profile;
