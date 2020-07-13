import { APP_URLS } from 'constants/APP_URLS';

export const menu = [
  {
    category: true,
    title: 'Dashboards',
  },
  {
    title: 'Dashboards',
    key: 'dashboards',
    icon: 'fe fe-home',
    url: APP_URLS.dashboard,
  },
  {
    category: true,
    title: 'Account',
  },
  {
    title: 'Settings',
    key: 'settings',
    icon: 'fe fe-settings',
    children: [
      {
        title: 'Profile',
        key: 'profile',
        url: APP_URLS.settings_Profile,
        icon: 'fe fe-user',
        // role: ['admin'],
      },
      {
        title: 'Two-factors Auth',
        key: 'Two-factors Auth',
        url: APP_URLS.settings_2FA,
        icon: 'fe fe-pocket',
      },
    ],
  },
  {
    title: 'Referral',
    key: 'referrals',
    icon: 'fe fe-users',
    children: [
      {
        title: 'Referral Link',
        key: 'referral',
        url: APP_URLS.referral,
        icon: 'fe fe-link',
      },
      {
        title: 'Bonus',
        key: 'bonus',
        url: APP_URLS.bonus,
        icon: 'fe fe-money',
      },
    ],
  },
];
