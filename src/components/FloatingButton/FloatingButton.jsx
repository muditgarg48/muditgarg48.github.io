import React, { memo } from 'react';
import './FloatingButton.css';
import ChatIcon from '../../assets/svg/ChatIcon';

const FloatingButton = ({
  onClick,
  onPointerEnter,
  onFocus,
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
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
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
