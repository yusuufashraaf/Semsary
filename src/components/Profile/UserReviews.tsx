import './UserReviews.css';

const UserReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "David Lee",
      time: "2 months ago",
      rating: 5,
      content: "This property exceeded my expectations! The location was perfect, and the amenities were top-notch. I highly recommend it to anyone looking for a comfortable and convenient stay."
    },
    {
      id: 2,
      name: "David Lee",
      time: "3 months ago",
      rating: 4,
      content: "The property was great overall, with a few minor issues. The location was ideal, and the space was well-maintained. I would consider staying here again."
    },
    {
      id: 3,
      name: "David Lee",
      time: "4 months ago",
      rating: 3,
      content: "The property was decent, but it didn't quite meet my expectations. The location was okay, but there were some issues with cleanliness and maintenance. I might look for other options next time."
    }
  ];

  const renderStars = (rating:number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        {index < rating ? '★' : '☆'}
      </span>
    ));
  };

  return (
    <div className="user-reviews">
      <h1 className="reviews-title">My Reviews</h1>
      
      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-info">
                <h3 className="reviewer-name">{review.name}</h3>
                <span className="review-time">{review.time}</span>
              </div>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
            </div>
            
            <div className="review-separator"></div>
            
            <p className="review-content">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReviews;