import React from 'react';

const NotificationStack = ({ notifications = [], onRemove }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-stack">
      {notifications.map((note) => (
        <div key={note.id} className={`notification ${note.type || 'info'}`}>
          <span className="notification-message">{note.message}</span>
          <button
            className="dismiss-btn"
            onClick={() => onRemove && onRemove(note.id)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationStack;
