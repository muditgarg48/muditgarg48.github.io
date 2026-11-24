export const SITE_MODES = {
  recruiter: 'recruiter',
  freelance: 'freelance',
};

export function getDefaultSiteMode() {
  return process.env.NEXT_PUBLIC_DEFAULT_MODE === 'freelance'
    ? SITE_MODES.freelance
    : SITE_MODES.recruiter;
}

export const MODE_ASSETS = {
  recruiter: {
    favicon: '/favicon-recruiter.ico',
    appleTouchIcon: '/logo192-recruiter.png',
    themeColor: '#00abf0',
    primaryColor: '#00abf0',
  },
  freelance: {
    favicon: '/favicon-freelance.ico',
    appleTouchIcon: '/logo192-freelance.png',
    themeColor: '#00679a',
    primaryColor: '#00679a',
  },
};
