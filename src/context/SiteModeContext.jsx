import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PALETTES = {
  recruiter: {
    '--bg-color': '#081b29',
    '--text-color': '#ededed',
    '--primary-color': '#00abf0',
    '--secondary-color': '#00acf0b4',
    '--card-bg': '#112240',
    '--nav-bg': '#081b29ee',
    '--font-primary-color': '#00abf0',
    '--font-secondary-color': '#00acf0b4',
    '--font-highlight-color': '#FFF5EE',
    '--hello-color': 'yellow',
  },
  freelance: {
    '--bg-color': '#f8f6f1',
    '--text-color': '#1c2b1e',
    '--primary-color': '#2d5a3d',
    '--secondary-color': '#2d5a3d99',
    '--card-bg': '#eae6dc',
    '--nav-bg': '#f8f6f1ee',
    '--font-primary-color': '#2d5a3d',
    '--font-secondary-color': '#2d5a3d99',
    '--font-highlight-color': '#1c2b1e',
    '--hello-color': '#c45720',
  },
};

const SiteModeContext = createContext(undefined);

export function SiteModeProvider({ children }) {
  const defaultMode =
    import.meta.env.VITE_DEFAULT_MODE === 'freelance' ? 'freelance' : 'recruiter';

  const [mode, setMode] = useState(defaultMode);

  const isFreelance = mode === 'freelance';
  const primaryColor = PALETTES[mode]['--primary-color'];

  const applyPalette = useCallback((currentMode) => {
    const palette = PALETTES[currentMode];
    const root = document.documentElement;
    Object.entries(palette).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });
  }, []);

  useEffect(() => {
    applyPalette(mode);

    // Update Favicon and Apple Touch Icon
    const favicon = document.getElementById('favicon');
    const appleTouchIcon = document.getElementById('apple-touch-icon');
    const themeColor = document.querySelector('meta[name="theme-color"]');

    if (mode === 'freelance') {
      if (favicon) favicon.href = '/favicon-freelance.ico';
      if (appleTouchIcon) appleTouchIcon.href = '/logo192-freelance.png';
      if (themeColor) themeColor.setAttribute('content', '#2d5a3d');
    } else {
      if (favicon) favicon.href = '/favicon-recruiter.ico';
      if (appleTouchIcon) appleTouchIcon.href = '/logo192-recruiter.png';
      if (themeColor) themeColor.setAttribute('content', '#00abf0');
    }
  }, [mode, applyPalette]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'recruiter' ? 'freelance' : 'recruiter'));
  }, []);

  return (
    <SiteModeContext.Provider value={{ mode, toggleMode, isFreelance, primaryColor }}>
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