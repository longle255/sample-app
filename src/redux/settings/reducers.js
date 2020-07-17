import store from 'store';
import { menu } from 'constants/menu';
import { SettingActions } from './actions';

const STORED_SETTINGS = storedSettings => {
  const settings = {};
  Object.keys(storedSettings).forEach(key => {
    const item = store.get(`app.settings.${key}`);
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key];
  });
  return settings;
};

const initialState = {
  ...STORED_SETTINGS({
    menuData: menu,
    authProvider: 'firebase', // firebase, jwt
    logo: 'Clean UI Pro',
    locale: 'en-US',
    isSidebarOpen: false,
    isSupportChatOpen: false,
    isMobileView: false,
    isMobileMenuOpen: false,
    isMenuCollapsed: false,
    menuLayoutType: 'left', // left, top, nomenu
    routerAnimation: 'slide-fadein-up', // none, slide-fadein-up, slide-fadein-right, fadein, zoom-fadein
    menuColor: 'white', // white, dark, gray
    theme: 'default', // default, dark
    authPagesColor: 'white', // white, gray, image
    primaryColor: '#4b7cf3',
    leftMenuWidth: 256,
    isMenuUnfixed: false,
    isMenuShadow: false,
    isTopbarFixed: false,
    isGrayTopbar: false,
    isContentMaxWidth: false,
    isAppMaxWidth: false,
    isGrayBackground: false,
    isCardShadow: true,
    isSquaredBorders: false,
    isBorderless: false,
  }),
};

export function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case SettingActions.SET_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
