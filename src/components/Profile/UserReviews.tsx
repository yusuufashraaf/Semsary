import React, { useState, useEffect } from 'react';
import { fetchUserReviews } from '../../services/axios-global';
import './UserReviews.css';
import { Review } from 'src/types';

const UserReviews = () => {
  const [reviewsData, setReviewsData] = useState<Review[]>([]); // This will hold your JSON data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getReviewsData = async () => {
      try {
        setLoading(true);
        // Replace 1 with the actual user ID you want to fetch
        const data = await fetchUserReviews(5);
        setReviewsData(data); // Store the JSON data in state
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
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Now you can use reviewsData variable anywhere in your component
  console.log('Fetched reviews data:', reviewsData);

  return (
    <div className="user-reviews">
      <h1 className="reviews-title">My Reviews</h1>
      
      <div className="reviews-list">
        {reviewsData.map((review: Review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-info">
                <h3 className="reviewer-name">Review for: {review.property.title}</h3>
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