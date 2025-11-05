import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import './Modal.css';

const ANIMATION_DURATION = 350;
const MINIMIZE_ANIMATION_DURATION = 300;

const Modal = ({ isOpen, onClose, children, onMinimize, className = '' }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const isMinimizingRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setIsMinimizing(false);
      isMinimizingRef.current = false;
    } else if (shouldRender && !isMinimizingRef.current) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) {
      onCloseRef.current();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleEscape]);

  const handleMinimize = useCallback(() => {
    if (!onMinimize) {
      onCloseRef.current();
      return;
    }

    isMinimizingRef.current = true;
    setIsMinimizing(true);
    setTimeout(() => {
      setIsMinimizing(false);
      setShouldRender(false);
      isMinimizingRef.current = false;
      onCloseRef.current();
    }, MINIMIZE_ANIMATION_DURATION);
  }, [onMinimize]);

  const handleOverlayClick = useCallback(() => {
    onCloseRef.current();
  }, []);

  const handleContentClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!shouldRender) return null;

  const childProps = React.isValidElement(children) 
    ? { onClose: onCloseRef.current, onMinimize: handleMinimize }
    : {};

  const overlayClasses = [
    'modal-overlay',
    isClosing && 'closing',
    isMinimizing && 'minimizing',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={overlayClasses}
      onClick={handleOverlayClick}
    >
      <div className="modal-content" onClick={handleContentClick}>
        {React.isValidElement(children) 
          ? React.cloneElement(children, childProps)
          : children
        }
      </div>
    </div>
  );
};

export default memo(Modal);
