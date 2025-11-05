import React, { memo } from 'react';
import './FloatingButton.css';
import ChatIcon from '../../assets/svg/ChatIcon';

const FloatingButton = ({ 
  onClick, 
  isVisible = true,
  text = "Click Me",
  title,
  className = ''
}) => {
  if (!isVisible) return null;
  
  const buttonTitle = title || text;
  
  return (
    <button 
      className={`floating-button ${className}`}
      onClick={onClick} 
      title={buttonTitle}
    >
      <div className="fab-icon">
        <ChatIcon />
      </div>
      {text && <span className="fab-text">{text}</span>}
      <div className="fab-glow"></div>
    </button>
  );
};

export default memo(FloatingButton);

