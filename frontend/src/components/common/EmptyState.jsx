import React from 'react';

const EmptyState = ({ message = 'No data found.', ctaText, onCtaClick }) => {
  return (
    <div className="empty-state">
      <p className="empty-state-message">{message}</p>
      {ctaText && (
        <button className="cta-btn" onClick={onCtaClick}>
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
