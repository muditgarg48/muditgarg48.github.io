"use client";

import { useEffect, memo } from 'react';
import './AlfredDock.css';

const AlfredDock = ({ onClose, children }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <aside className="alfred-dock" role="dialog" aria-label="A.L.F.R.E.D. chat">
      {children}
    </aside>
  );
};

export default memo(AlfredDock);
