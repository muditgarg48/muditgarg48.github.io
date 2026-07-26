"use client";

import { useEffect, memo } from 'react';
import './AlfredDock.css';

const AlfredDock = ({ onMinimize, children }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onMinimize?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onMinimize]);

  return (
    <aside className="alfred-dock" role="dialog" aria-label="A.L.F.R.E.D. chat">
      {children}
    </aside>
  );
};

export default memo(AlfredDock);
