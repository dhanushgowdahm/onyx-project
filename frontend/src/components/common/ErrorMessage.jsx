// Error component for consistent error display
import React from 'react';
import './LoadingSpinner.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-message">
      <p>{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;