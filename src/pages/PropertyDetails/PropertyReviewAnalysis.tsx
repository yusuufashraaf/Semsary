import React, { useState } from "react";
import { getPropertyReviewAnalysis } from "../../services/ownerDashboard";
import { ReviewAnalysis } from "../../types/ReviewAnalysis";
import "./PropertyReviewAnalysis.css";

interface Props {
  propertyId: number;
  totalReviews?: number;
}

const PropertyReviewAnalysis: React.FC<Props> = ({ propertyId, totalReviews }) => {
  const [analysis, setAnalysis] = useState<ReviewAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setShowResults(false);
    
    try {
      const data = await getPropertyReviewAnalysis(propertyId);
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        setTimeout(() => {
          setShowResults(true);
        }, 500);
      } else {
        console.error(data.message || "Failed to fetch analysis");
      }
    } catch (err) {
      console.error("Error fetching analysis:", err);
    } finally {
      setLoading(false);
    }
  };
   // Don't render if no reviews exist
  if (totalReviews === 0) {
    return null;
  }
  return (
    <div className="review-analyzer">
      <div className="analyzer-header">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`ai-analyze-btn ${loading ? 'loading' : ''}`}
        >
          {loading && <div className="loading-spinner"></div>}
          <span className="ai-icon">🤖</span>
          <span className="btn-text">
            {loading ? 'Analyzing Reviews...' : 'Get AI Review Summary'}
          </span>
          {!loading && (
            <>
              <div className="sparkle sparkle-1"></div>
              <div className="sparkle sparkle-2"></div>
              <div className="sparkle sparkle-3"></div>
            </>
          )}
        </button>
        
        {!showResults && !loading && (
          <p className="helper-text">
            Save time! Get a comprehensive AI summary instead of reading all reviews
          </p>
        )}
      </div>

      {showResults && analysis && (
        <div className="results-container">
          <div className="summary-section">
            <div className="summary-header">
              <h3>📋 Comprehensive Review Summary</h3>
              <div className="summary-stats">
                {analysis.sentiment_summary && (
                  <div className="quick-stats">
                    <span className="stat positive">😊 {analysis.sentiment_summary.positive}</span>
                    <span className="stat negative">😞 {analysis.sentiment_summary.negative}</span>
                    <span className="stat neutral">😐 {analysis.sentiment_summary.neutral}</span>
                    {analysis.score && (
                      <span className="stat score">⭐ {analysis.score.toFixed(1)}/5</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="summary-content">
              <div className="summary-text">
                <p>{analysis.overall_summary}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyReviewAnalysis;