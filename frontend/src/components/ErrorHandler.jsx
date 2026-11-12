import React from 'react';

const ErrorHandler = ({ message, onRetry }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="error-banner">
      <span className="error-text">{message}</span>
      <button className="retry-btn" onClick={onRetry || (() => {})}>
        Retry
      </button>
    </div>
  );
};

export default ErrorHandler;
