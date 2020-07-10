import { push } from 'connected-react-router';
import { action } from 'typesafe-actions';
import throttle from 'lodash-es/throttle';
import { profileService } from 'services';
import { APP_URLS } from 'services/../constants/APP_URLS';

export const AuthActions = {
  LOGIN: '[AUTH] LOGIN',
  LOGOUT: '[AUTH] LOGOUT',

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

export const logOutAction = () => {
  return action(AuthActions.LOGOUT, null);
};

export const goToLoginPageAction = () => {
  return async (dispatch, getState) => {
    const url = APP_URLS.login;
    dispatch(push(url));
  };
};

export const goToSignUpPageAction = () => {
  return async (dispatch, getState) => {
    const url = APP_URLS.signUp;
    dispatch(push(url));
  };
};

export const goToForgotPasswordPageAction = () => {
  return async (dispatch, getState) => {
    const url = APP_URLS.forgotPassword;
    dispatch(push(url));
  };
};

export const goToSendVerifyEmailPageAction = () => {
  return async (dispatch, getState) => {
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
