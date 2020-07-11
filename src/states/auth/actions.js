import { push } from 'connected-react-router';
import { action } from 'typesafe-actions';
import throttle from 'lodash-es/throttle';
import { authService, StorageService, profileService } from 'services';
import { APP_URLS, PUBLIC_URLS } from 'services/../constants/APP_URLS';
import { setFromUrlAction } from 'states/app';

export const AuthActions = {
  LOGIN: '[AUTH] LOGIN',
  LOGOUT: '[AUTH] LOGOUT',

  SET_USER_STATE: '[AUTH] SET_USER_STATE',
  SET_HIDE_LOGIN: '[AUTH] SET_HIDE_LOGIN',

  GET_USER_PROFILE: '[AUTH] GET_USER_PROFILE',
  IS_LOADING_USER_PROFILE: '[AUTH] IS_LOADING_USER_PROFILE',
  CLEAR_USER_PROFILE: '[AUTH] CLEAR_USER_PROFILE',
  GET_COUNTRIES: '[AUTH] GET_COUNTRIES',
  IS_LOADING_COUNTRIES: '[AUTH] IS_LOADING_COUNTRIES',
  UPDATE_USER_PROFILE: '[AUTH] UPDATE_USER_PROFILE',
  SHOW_ENABLE_2FA_FORM: '[AUTH] SHOW_ENABLE_2FA_FORM',
  SHOW_DISABLE_2FA_FORM: '[AUTH] SHOW_DISABLE_2FA_FORM',
  UPDATE_2FA_STATE: '[AUTH] UPDATE_2FA_STATE',

  ACTION_SUCCEED: '[AUTH] ACTION_SUCCEED',
  ACTION_FAILED: '[AUTH] ACTION_FAILED',
};

export const REDUCER = 'login';
const APP_USER_KEY = StorageService.USER_INFO_KEY;

export const logOutAction = () => {
  return action(AuthActions.LOGOUT, null);
};

export const goToLoginPageAction = () => {
  return async dispatch => {
    const url = APP_URLS.signIn;
    dispatch(push(url));
  };
};

export const goToSignUpPageAction = () => {
  return async dispatch => {
    const url = APP_URLS.signUp;
    dispatch(push(url));
  };
};

export const goToForgotPasswordPageAction = () => {
  return async dispatch => {
    const url = APP_URLS.forgotPassword;
    dispatch(push(url));
  };
};

export const goToSendVerifyEmailPageAction = () => {
  return async dispatch => {
    const url = APP_URLS.sendVerifyEmail;
    dispatch(push(url));
  };
};

/* #region Get user profile */
export const getUserProfileAction = () => {
  return action(AuthActions.GET_USER_PROFILE, null);
};

export const isLoadingUserProfileAction = () => {
  return action(AuthActions.IS_LOADING_COUNTRIES, null);
};

export const getUserProfileSuccessAction = data => {
  return action(AuthActions.ACTION_SUCCEED, data, AuthActions.GET_USER_PROFILE);
};

export const getUserProfileFailureAction = error => {
  return action(AuthActions.ACTION_FAILED, error, AuthActions.GET_USER_PROFILE);
};

export const updateUserProfileSuccessAction = data => {
  return action(AuthActions.ACTION_SUCCEED, data, AuthActions.UPDATE_USER_PROFILE);
};

/* #endregion */

/* #region Get countries */
export const getCountriesAction = () => {
  return async (dispatch, getState) => {
    dispatch(isLoadingCountriesAction());

    try {
      const result = await profileService.getCountries();

      dispatch(getCountriesSuccessAction(result));
    } catch (error) {
      dispatch(getCountriesFailureAction(error));
    }
  };
};

export const isLoadingCountriesAction = () => {
  return action(AuthActions.IS_LOADING_USER_PROFILE, null);
};

export const getCountriesSuccessAction = data => {
  return action(AuthActions.ACTION_SUCCEED, data, AuthActions.GET_COUNTRIES);
};

export const getCountriesFailureAction = error => {
  return action(AuthActions.ACTION_FAILED, error, AuthActions.GET_COUNTRIES);
};
/* #endregion */

/* #region 2FA */
export const showEnable2FAFormAction = data => {
  return async (dispatch, getState) => {
    const url = `${APP_URLS.settings_2FA}?state=enable`;

    dispatch(push(url));
  };
};

export const showDisable2FAFormAction = data => {
  return async (dispatch, getState) => {
    const url = `${APP_URLS.settings_2FA}?state=disable`;

    dispatch(push(url));
  };
};

export const update2FAStateSuccessAction = data => {
  return async (dispatch, getState) => {
    dispatch(action(AuthActions.ACTION_SUCCEED, data, AuthActions.UPDATE_2FA_STATE));

    const url = APP_URLS.settings_2FA;
    dispatch(push(url));
  };
};

/* #endregion */

export const setUserState = payload => action(AuthActions.SET_USER_STATE, payload);
const setHideLoginAction = payload => action(AuthActions.SET_HIDE_LOGIN, payload);

export const initAuth = roles => (dispatch, getState) => {
  const user = StorageService.getData(APP_USER_KEY) || {};
  const state = getState();
  const { location } = state.router;
  const { pathname } = location;
  const isPublicUrl = pathname !== '/' && PUBLIC_URLS.some(url => url.startsWith(pathname));

  const setUser = userState => {
    dispatch(
      setUserState({
        ...userState,
      }),
    );

    if (!state.auth.userProfile) {
      dispatch(getUserProfileAction());
    }

    if (!roles.find(role => role === user.role)) {
      if (!(state.router.location.pathname === APP_URLS.dashboard)) {
        dispatch(push(APP_URLS.dashboard));
      }

      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  };

  const nonLoginUser = userState => {
    dispatch(
      setUserState({
        ...userState,
      }),
    );

    return Promise.resolve(true);
  };

  // Set the user ID for GA
  if (window.ga) {
    const userId = user.id || StorageService.getInstallId();
    window.ga('set', 'userId', userId);
  }

  switch (user.role) {
    case 'admin':
    case 'user':
      return setUser(user);

    default:
      if (isPublicUrl) {
        return nonLoginUser(user);
      }

      const from = location.pathname + location.search;
      dispatch(setFromUrlAction(from));
      // TODO: switch this for pool
      // dispatch(push(APP_URLS.poolStats));
      dispatch(push(APP_URLS.login));
      return Promise.reject();
  }
};

export const loginSucceedAction = (result, fromUrl) => dispatch => {
  StorageService.setToken(result.access_token);
  StorageService.setData(APP_USER_KEY, result.profile);

  // Set the user ID for GA
  if (window.ga) {
    const userId = result.profile.id;
    window.ga('set', 'userId', userId);
  }

  dispatch(getUserProfileAction());
  dispatch(setHideLoginAction(true));

  // Get previous url
  const url = fromUrl || APP_URLS.dashboard;
  dispatch(push(url));
};

export const logout = () => dispatch => {
  dispatch(
    setUserState({
      userState: {
        email: '',
        role: '',
      },
    }),
  );
  dispatch(logOutAction());

  StorageService.removeToken();
  StorageService.removeData(APP_USER_KEY);

  dispatch(push(APP_URLS.login));
};

export const resetHideLogin = () => (dispatch, getState) => {
  const state = getState();
  if (state.pendingTasks === 0 && state.app.isHideLogin) {
    dispatch(setHideLoginAction(false));
  }
  return Promise.resolve();
};
