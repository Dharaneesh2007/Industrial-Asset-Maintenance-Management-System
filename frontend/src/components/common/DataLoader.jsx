import React from 'react';

const DataLoader = ({ isLoading, message = 'Loading...', children }) => {
  if (isLoading) {
    return (
      <div className="loading loading-state" data-testid="loader">
        <div className="btn-spinner"></div>
        <span>{message}</span>
      </div>
    );
  }
  return children || null;
};

export default DataLoader;
