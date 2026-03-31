import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ show, message = 'Link copied to clipboard!', duration = 2000, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="toast">
      <span>{message}</span>
    </div>
  );
};

export default Toast;