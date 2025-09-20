import React, { useState, useEffect } from 'react';
import { fetchUserReviews } from '../../services/axios-global';
import { Review } from 'src/types';

const UserReviews = () => {
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getReviewsData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserReviews(4);
        setReviewsData(data);
      } catch (err) {
        setError('Failed to fetch reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getReviewsData();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        {index < rating ? '★' : '☆'}
      </span>
    ));
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

  return (
    <div className="container">
      <h1 className="heading-primary">My Reviews</h1>
      
      <div className="list">
        {reviewsData.map((review: Review) => (
          <div key={review.id} className="card card-hover">
            <div className="review-header">
              <div className="reviewer-info">
                <h3 className="heading-tertiary">Review for: {review.property.title}</h3>
                <span className="review-time">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
            </div>
            
            <div className="review-separator"></div>
            
            <p className="review-content">{review.review}</p>
            
            <div className="property-details">
              <h4>Property Details:</h4>
              <p>{review.property.location.address}, {review.property.location.city}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReviews;