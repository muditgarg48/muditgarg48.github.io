import React, { memo } from 'react';
import './FloatingButton.css';
import ChatIcon from '../../assets/svg/ChatIcon';

const FloatingButton = ({
  onClick,
  isVisible = true,
  text = "A.L.F.R.E.D.",
  title,
  className = ''
}) => {
  if (!isVisible) return null;

  const buttonTitle = title || text;

  return (
    <button
      type="button"
      className={`alfred-ribbon ${className}`}
      onClick={onClick}
      title={buttonTitle}
      aria-label={buttonTitle}
    >
      <span className="alfred-ribbon-icon" suppressHydrationWarning>
        <ChatIcon />
      </span>
      {text && <span className="alfred-ribbon-label">{text}</span>}
    </button>
  );
};

export default memo(FloatingButton);
