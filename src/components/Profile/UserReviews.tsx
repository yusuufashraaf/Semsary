import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserReviews } from '../../services/axios-global';
import { Review } from 'src/types';
import { TFullUser } from 'src/types/users/users.types';

const UserReviews = ({ user }: { user: TFullUser }) => {
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getReviewsData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserReviews(user.id);
        setReviewsData(data);
      } catch (err) {
        setError('Failed to fetch reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getReviewsData();
  }, [user.id]);

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

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading reviews...</div>
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

  if (reviewsData.length === 0) {
    return (
      <div className="container">
        <h1 className="heading-primary">My Reviews</h1>
        <div className="no-reviews">No reviews found.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="heading-primary">My Reviews</h1>
      
      <div className="list">
        {reviewsData.map((review: Review) => (
          <div 
            key={review.id} 
            className="card card-hover"
            onClick={() => handleCardClick(review.property.id)}
            style={{ cursor: 'pointer' }}
          >
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
        ))}
      </div>
    </div>
  );
};

export default UserReviews;