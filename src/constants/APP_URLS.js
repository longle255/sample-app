export const APP_URLS = {
  signIn: '/auth/signin',
  signUp: '/auth/signup',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/confirm-email',
  sendVerifyEmail: '/auth/send-verify-email',

  dashboard: '/dashboard',

  // User
  referral: '/referral/links',
  bonus: '/referral/bonus',
  settings_Profile: '/settings/profile',
  settings_2FA: '/settings/2fa',

  notFound: '/404',
  error: '/500',
};

export const PUBLIC_URLS = [];
PUBLIC_URLS.push(APP_URLS.poolStats);
PUBLIC_URLS.push(APP_URLS.blockStats);

export const EXCLUDING_URLS = [APP_URLS.resetPassword];
