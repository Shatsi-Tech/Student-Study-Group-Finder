import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showSuccess = (msg) => addToast(msg, 'success');
  const showError = (msg) => addToast(msg, 'danger');
  const showInfo = (msg) => addToast(msg, 'info');
  const showWarning = (msg) => addToast(msg, 'warning');

  return (
    <NotificationContext.Provider value={{ addToast, showSuccess, showError, showInfo, showWarning }}>
      {children}
      {/* Toast container overlay */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 380
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              backgroundColor: toast.type === 'success' ? '#10b981' :
                               toast.type === 'danger' ? '#ef4444' :
                               toast.type === 'warning' ? '#f59e0b' : '#0b3b60',
              color: '#ffffff',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
