import { useState, useEffect } from 'react';
//import PropertyCard from './PropertyCard';
import { fetchUserWishlists } from '@services/axios-global';
import { TFullUser } from 'src/types/users/users.types';
import PropertyCard from '@components/PropertyList/PropertCard';
import { toast } from 'react-toastify';
import { Listing } from 'src/types';

interface WishlistItem {
  id: number;
  user_id: number;
  property_id: number;
  created_at: string;
  updated_at: string;
  // property: {
  //   id: number;
  //   owner_id: number;
  //   title: string;
  //   description: string;
  //   type: string;
  //   price: string;
  //   price_type: string;
  //   location: {
  //     address: string;
  //     city: string;
  //     lat: number;
  //     lng: number;
  //   };
  //   size: number;
  //   property_state: string;
  //   status: string;
  //   created_at: string;
  //   updated_at: string;
  //   bedrooms: number;
  //   bathrooms: number;
  //   is_in_wishlist: boolean;
  // };
  property: Listing;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    // ... other user fields
  };
}

const UserWishlist = ({ user }: {user: TFullUser })=> {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedProperties, setSavedProperties] = useState<number[]>([]);

  useEffect(() => {
    const getWishlistData = async () => {
      try {
        setLoading(true);
        const response = await fetchUserWishlists(user.id);
        
        // Handle different possible response structures
        let items: WishlistItem[] = [];
        
        if (Array.isArray(response)) {
          // If response is directly an array
          items = response;
        } else if (response && Array.isArray(response.data)) {
          // If response has a data property that is an array
          items = response.data;
        } else if (response && typeof response === 'object') {
          // If response is a single object, wrap it in an array
          items = [response];
        } else {
          console.warn('Unexpected API response structure:', response);
          setError('Unexpected data format received from server');
        }
        
        setWishlistItems(items);
      } catch (err) {
        setError('Failed to fetch wishlist items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getWishlistData();
  }, []);

  // the calculateAverageRating function is NOT used anywhere in the Semsary codebase.
  // // Calculate average rating safely
  // const calculateAverageRating = () => {
  //   if (!Array.isArray(wishlistItems) || wishlistItems.length === 0) return 0;
    
  //   // Since your response doesn't include ratings, we'll use a placeholder
  //   // If you have ratings in your actual data, update this calculation
  //   return 4.5; // Placeholder average rating
  // };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

const toggleSavedProperty = (id: number) => {
    setSavedProperties((prev) => {
      const isSaved = prev.includes(id);
      const updated = isSaved ? prev.filter((i) => i !== id) : [...prev, id];

      // Toast feedback
      if (isSaved) toast.info("Removed from wishlist");
      else toast.success("Added to wishlist");

      return updated;
    });
  };

  return (
    <div className="container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-heart"></i>
          </div>
          <div className="stat-info">
            <h3>{Array.isArray(wishlistItems) ? wishlistItems.length : 0}</h3>
            <p>Total Wishlist Items</p>
          </div>
        </div>
      </div>

      <div className="content-header">
        <h2 className="heading-secondary">My Wishlist</h2>
      </div>

      <div className="list">
        {!Array.isArray(wishlistItems) || wishlistItems.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-heart empty-state-icon"></i>
            <h3>Your wishlist is empty</h3>
            <p>Start saving properties you love to see them here.</p>
            <button className="btn btn-primary">
              Browse Properties
            </button>
          </div>
        ) : (
          wishlistItems.map(wishlistItem => (
            // <PropertyCard
            //   key={wishlistItem.id}
            //   property={formatPropertyForCard(wishlistItem)}
            //   onSave={handleSave}
            //   section="wishlist"
            // />
            <PropertyCard
                                  property={wishlistItem.property}
                                  viewMode={"list"}
                                  savedProperties={savedProperties}
                                  toggleSavedProperty={toggleSavedProperty}
                                />
          ))
        )}
      </div>
    </div>
  );
};



export default UserWishlist;