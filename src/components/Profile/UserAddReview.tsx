// components/Reviews/AddReview.tsx
import React, { useState, useEffect } from 'react';
import { reviewService } from '@services/axios-global';
import { CreateReviewData, Property } from 'src/types';

interface AddReviewProps {
  userId: number;
  onReviewAdded: () => void;
  onCancel: () => void;
  refreshTrigger?: number; // New prop to trigger refresh
}

const UserAddReview: React.FC<AddReviewProps> = ({ 
  onReviewAdded, 
  onCancel, 
  refreshTrigger = 0 // Default value
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | ''>('');
  const [formData, setFormData] = useState<Omit<CreateReviewData, 'property_id' | 'user_id'>>({
    comment: '',
    rating: 5
  });
  const [loading, setLoading] = useState(false);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviewable properties function
  const fetchReviewableProperties = async () => {
    try {
      setPropertiesLoading(true);
      const response = await reviewService.getReviewableProperties();
      setProperties(response.properties);
      
      // Auto-select the first property if available
      if (response.properties.length > 0) {
        setSelectedPropertyId(response.properties[0].id);
      } else {
        setSelectedPropertyId('');
      }
    } catch (err: any) {
      setError('Failed to load properties');
      console.error('Error fetching properties:', err);
    } finally {
      setPropertiesLoading(false);
    }
  };

  // Initial fetch and refetch when refreshTrigger changes
  useEffect(() => {
    fetchReviewableProperties();
  }, [refreshTrigger]); // Add refreshTrigger as dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPropertyId) {
      setError('Please select a property');
      return;
    }
    
    if (!formData.comment.trim() || formData.rating < 1 || formData.rating > 5) {
      setError('Please provide a comment and valid rating (1-5)');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await reviewService.createReview({
        property_id: selectedPropertyId as number,
        ...formData
      });

      // Call the parent's refresh function
      onReviewAdded();
      
      // Reset form
      setFormData({ comment: '', rating: 5 });
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  if (propertiesLoading) {
    return (
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="loading">Loading properties...</div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="empty-state">
          <i className="fas fa-home empty-state-icon"></i>
          <h3>No Properties to Review</h3>
          <p>You don't have any properties that you can review at the moment.</p>
          <button 
            className="btn btn-secondary" 
            onClick={onCancel}
            style={{ marginTop: 'var(--spacing-md)' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <h3 className="heading-tertiary">Add Your Review</h3>
        {/* <button 
          onClick={fetchReviewableProperties} 
          disabled={propertiesLoading}
          className="btn btn-secondary btn-sm"
        >
          {propertiesLoading ? 'Refreshing...' : 'Refresh Properties'}
        </button> */}
      </div>
      
      {error && (
        <div className="error" style={{ marginBottom: 'var(--spacing-md)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Property Selection */}
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label htmlFor="property" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
            Select Property to Review *
          </label>
          <select
            id="property"
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(Number(e.target.value))}
            required
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-base)'
            }}
          >
            <option value="">Choose a property...</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.title} - #{property.id}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Selection */}
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label htmlFor="rating" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
            Rating *
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-base)'
            }}
          >
            {[5, 4, 3, 2, 1].map(rating => (
              <option key={rating} value={rating}>
                {rating} {rating === 1 ? 'Star' : 'Stars'}
              </option>
            ))}
          </select>
        </div>

        {/* Comment Textarea */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label htmlFor="comment" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
            Review Comment *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            minLength={5}
            rows={4}
            placeholder="Share your experience with this property..."
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              border: '1px solid var(--primary-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-base)',
              resize: 'vertical',
              minHeight: '100px'
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !formData.comment.trim() || !selectedPropertyId}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserAddReview;