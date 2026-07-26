"use client";

import { useState, useEffect } from 'react';

/** Scroll/layout container for the homepage site column */
export const SITE_SCROLL_ID = 'site-scroll';

export function getSitePaneWidth() {
  if (typeof window === 'undefined') return 0;
  return document.getElementById(SITE_SCROLL_ID)?.clientWidth ?? window.innerWidth;
}

/** Tracks the site pane width (falls back to the viewport if the pane is missing). */
export function useSitePaneWidth() {
  const [width, setWidth] = useState(() => getSitePaneWidth());

  useEffect(() => {
    const el = document.getElementById(SITE_SCROLL_ID);

    if (!el) {
      const sync = () => setWidth(window.innerWidth);
      sync();
      window.addEventListener('resize', sync);
      return () => window.removeEventListener('resize', sync);
    }

    const sync = () => setWidth(el.clientWidth);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return width;
}
