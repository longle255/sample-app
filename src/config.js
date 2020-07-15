const appConfig = {
  production: process.env.PRODUCTION === 'true',
  apiUrl: process.env.API_URL,
  appUrl: process.env.APP_URL,
  webUrl: process.env.WEB_URL,
  wsUri: process.env.WS_URI,
  wsActionPrefix: process.env.WS_ACTION_PREFIX || '/socket',
  explorerUrl: process.env.EXPLORER_URL,
};

const siteConfig = {
  siteName: process.env.SITE_NAME,
  siteIcon: 'ion-android-cloud-circle',
  footerText: 'Copyright 2020 © stakings.club. All rights reserved.',
  appVersion: process.env.APP_VERSION,
  buildDate: process.env.BUILD_DATE,
  buildNumber: process.env.BUILD_NUMBER || '',
  coinsImages: process.env.STATIC_HOST_COINS_IMAGES,
  discordLink: process.env.DISCORD_LINK,
  tosLink: process.env.TOS_LINK,
};

const RecaptchaConfig = {
  key: process.env.RECAPTCHA_KEY,
};

const googleConfig = {
  apiKey: process.env.GOOGLE_API_KEY,
  gaTrackingId: process.env.GA_TRACKING_ID,
  trackerName: process.env.GA_TRACKER_NAME,
  isEnabledDebugGa: process.env.GA_IS_ENABLED_DEBUG === 'true',
};

console.log('=======================================================');
console.log(
  ` ${siteConfig.siteName} version: ${siteConfig.appVersion}. #${siteConfig.buildNumber} ${siteConfig.buildDate}`,
);
console.log('=======================================================');
console.log('%c%s', 'color: white; background: red; font-size: 24px;', '  STOP!   ');
console.log('This browser feature is intended for developers.');
console.log('If someone told you to copy-paste something here,');
console.log('it is a scam and will give them access to your account.!');

// For debugging
// console.info(process.env.PRODUCTION);
// console.info(process.env.NODE_ENV);
// console.info(process.env.API_URL, appConfig);

export { appConfig, siteConfig, RecaptchaConfig, googleConfig };
