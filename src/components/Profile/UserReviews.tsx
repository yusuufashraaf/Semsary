import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserReviews, reviewService } from '../../services/axios-global';
import { Review } from 'src/types';
import { TFullUser } from 'src/types/users/users.types';
import Loader from '@components/common/Loader/Loader';
import UserAddReview from './UserAddReview';

const UserReviews = ({ user }: { user: TFullUser }) => {
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshAddReview, setRefreshAddReview] = useState(0); // New state for AddReview refresh
  const navigate = useNavigate();

  // Fetch reviews function
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserReviews(user.id);
      setReviewsData(data);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReviews();
  }, [user.id]);

  // Refresh both reviews list and add review component
  const refreshAll = () => {
    setRefreshing(true);
    setRefreshAddReview(prev => prev + 1); // Trigger AddReview refresh
    fetchReviews();
  };

  // Delete review function
  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      setRefreshing(true);
      await reviewService.deleteReview(reviewId);
      // Refresh both components after deletion
      refreshAll();
    } catch (err: any) {
      setError('Failed to delete review');
      console.error('Error deleting review:', err);
      setRefreshing(false);
    }
  };

  // Handle when a new review is added
  const handleReviewAdded = () => {
    refreshAll();
  };

  // Function to specifically refresh just the AddReview component
  const refreshAddReviewComponent = () => {
    setRefreshAddReview(prev => prev + 1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        {index < rating ? '★' : '☆'}
      </span>
    ));
  };

  const formatAddress = (location: any) => {
    if (!location) return 'Address not available';
    
    const parts = [
      location.address,
      location.city,
      location.state,
      location.zip_code
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ');
  };

  const handleCardClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  if (loading && !refreshing) {
    return (
      <div className="container">
        <div className="loading"><Loader message='Loading reviews...' /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
        <button onClick={refreshAll} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="heading-primary">My Reviews</h1>
        {/* <button 
          onClick={refreshAll} 
          disabled={refreshing}
          className="btn btn-secondary"
        >
          {refreshing ? 'Refreshing...' : 'Refresh All'}
        </button> */}
      </div>
      
      {reviewsData.length === 0 ? (
        <div className="no-reviews">
          <i className="fas fa-comment-slash" style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)', opacity: 0.5 }}></i>
          <h3>No Reviews Yet</h3>
          <p>You haven't written any reviews yet.</p>
        </div>
      ) : (
        <div className="list">
          {reviewsData.map((review: Review) => (
            <div 
              key={review.id} 
              className="card card-hover"
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteReview(review.id);
                }}
                disabled={refreshing}
                className="btn btn-danger btn-sm"
                style={{
                  position: 'absolute',
                  top: 'var(--spacing-md)',
                  right: 'var(--spacing-md)',
                  zIndex: 10
                }}
                title="Delete Review"
              >
                {refreshing ? '...' : '×'}
              </button>

              <div onClick={() => handleCardClick(review.property.id)}>
                <div className="review-header">
                  <div className="reviewer-info">
                    <h3 className="heading-tertiary">
                      Review for: {review.property.title}
                    </h3>
                    <span className="review-time">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <div className="review-separator"></div>
                
                <p className="review-content">{review.comment}</p>
                
                <div className="property-details">
                  <h4>Property Details:</h4>
                  <p>{formatAddress(review.property.location)}</p>
                  <p>Type: {review.property.type} • {review.property.bedrooms} beds • {review.property.bathrooms} baths</p>
                  <p>Price: ${review.property.price} {review.property.price_type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Review Component with refresh trigger */}
      <UserAddReview 
        userId={user.id} 
        onReviewAdded={handleReviewAdded} 
        onCancel={() => {}} 
        refreshTrigger={refreshAddReview} // Pass the refresh trigger
      />
    </div>
  );
};

export default UserReviews;