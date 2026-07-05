"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getDefaultSiteMode, MODE_ASSETS } from '../config/siteMode';

const SiteModeContext = createContext(undefined);

function updateModeAssets(mode) {
  document.documentElement.setAttribute('data-mode', mode);

  const assets = MODE_ASSETS[mode];
  const favicon = document.getElementById('favicon');
  const appleTouchIcon = document.getElementById('apple-touch-icon');
  const themeColor = document.querySelector('meta[name="theme-color"]');

  if (favicon) favicon.href = assets.favicon;
  if (appleTouchIcon) appleTouchIcon.href = assets.appleTouchIcon;
  if (themeColor) themeColor.setAttribute('content', assets.themeColor);
}

export function SiteModeProvider({ children }) {
  const defaultMode = getDefaultSiteMode();
  const [mode, setMode] = useState(defaultMode);

  const isFreelance = mode === 'freelance';
  const primaryColor = MODE_ASSETS[mode].primaryColor;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
  }, []);

  useEffect(() => {
    updateModeAssets(mode);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'recruiter' ? 'freelance' : 'recruiter'));
  }, []);

  return (
    <SiteModeContext.Provider value={{ mode, toggleMode, setMode, isFreelance, primaryColor }}>
      {children}
    </SiteModeContext.Provider>
  );
}

export function useSiteMode() {
  const ctx = useContext(SiteModeContext);
  if (ctx === undefined) {
    throw new Error('useSiteMode must be used within a SiteModeProvider');
  }
  return ctx;
}

export default SiteModeContext;