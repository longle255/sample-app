import { siteConfig } from 'config.js';
import { SettingActions } from './actions';
import { AuthActions } from '../auth/actions';

const initialState = {
  server: null,

  // app settings
  logo: siteConfig.siteName,
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
  authPagesColor: 'image', // white, gray, image
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
};

export function settingReducer(state = initialState, action) {
  const data = action.payload;

  switch (action.type) {
    case AuthActions.LOGOUT:
      return {
        ...initialState,
      };

    case SettingActions.IS_LOADING_SERVER_SETTING:
      return {
        ...state,
        server: {
          ...state.server,
          ...data,
          isLoading: true,
          isLoadedData: false,
        },
      };

    case SettingActions.ACTION_SUCCEED:
      return actionSuccessReducer(state, action);

    case SettingActions.ACTION_FAILED:
      return actionFailReducer(state, action);

    default:
      return state;
  }
}

function actionSuccessReducer(state, action) {
  const data = action.payload;
  const subType = action.meta;
  state.stateErrors = {};

  switch (subType) {
    case SettingActions.GET_SERVER_SETTING:
      return {
        ...state,
        server: {
          ...data,
          isLoading: false,
          isLoadedData: true,
          stateErrors: {},
        },
      };

    default:
      return state;
  }
}

function actionFailReducer(state, action) {
  const err = action.payload;
  const subType = action.meta;
  const errors = { ...state.stateErrors };
  errors[subType] = err;

  switch (subType) {
    case SettingActions.GET_SERVER_SETTING:
      return {
        ...state,
        server: {
          ...state.server,
          isLoading: false,
          isLoadedData: false,
          stateErrors: errors,
        },
      };

    default:
      return {
        ...state,
        stateErrors: errors,
      };
  }
}
