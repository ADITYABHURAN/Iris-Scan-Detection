import React from 'react';
import './ConfidenceScore.css';

const ConfidenceScore = ({ score, isAnimating }) => {
  const getConfidenceLevel = (score) => {
    if (score >= 90) return { level: 'excellent', color: '#28a745', label: 'Excellent Match' };
    if (score >= 80) return { level: 'good', color: '#ffc107', label: 'Good Match' };
    return { level: 'poor', color: '#dc3545', label: 'Failed Match' };
  };

  const confidence = getConfidenceLevel(score);

  return (
    <div className="confidence-score-container">
      <div className="confidence-header">
        <h3>Confidence Score</h3>
        <div className="confidence-value" style={{ color: confidence.color }}>
          {isAnimating ? (
            <span className="score-animating">Analyzing...</span>
          ) : (
            <>
              <span className="score-number">{score}%</span>
              <span className="score-label">{confidence.label}</span>
            </>
          )}
        </div>
      </div>

      <div className="progress-bar-container">
        <div 
          className={`progress-bar ${confidence.level} ${isAnimating ? 'animating' : ''}`}
          style={{ 
            width: isAnimating ? '100%' : `${score}%`,
            backgroundColor: confidence.color
          }}
        >
          {!isAnimating && score > 0 && (
            <span className="progress-text">{score}%</span>
          )}
        </div>
      </div>

      <div className="confidence-legend">
        <div className="legend-item">
          <span className="legend-dot excellent"></span>
          <span>90-100%: Excellent</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot good"></span>
          <span>80-89%: Good</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot poor"></span>
          <span>&lt;80%: Failed</span>
        </div>
      </div>

      {score >= 80 && !isAnimating && (
        <div className="confidence-badge">
          <span className="badge-icon">✓</span>
          <span className="badge-text">Authenticated</span>
        </div>
      )}

      {score > 0 && score < 80 && !isAnimating && (
        <div className="confidence-badge failed">
          <span className="badge-icon">✗</span>
          <span className="badge-text">Authentication Failed</span>
        </div>
      )}
    </div>
  );
};

export default ConfidenceScore;
