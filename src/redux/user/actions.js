import { action } from 'typesafe-actions';

export const UserActions = {
  SET_PROFILE: '[USER] SET_PROFILE',

  GET_USER_PROFILE: '[USER] GET_USER_PROFILE',

  IS_LOADING_USER_PROFILE: '[USER] IS_LOADING_USER_PROFILE',

  ENABLE_2FA: '[USER] ENABLE_2FA',
  IS_UPDATING_2FA: '[USER] IS_UPDATING_2FA',
  CONFIRM_2FA: '[USER] CONFIRM_2FA',

  DISABLE_2FA: '[USER] DISABLE_2FA',

  SHOW_2FA_ENABLE_FORM: '[USER] SHOW_2FA_ENABLE_FORM',
  SHOW_2FA_DISABLE_FORM: '[USER] SHOW_2FA_DISABLE_FORM',

  UPDATE_USER_PROFILE: '[USER] UPDATE_USER_PROFILE',

  ACTION_SUCCEED: '[USER] ACTION_SUCCEED',
  ACTION_FAILED: '[USER] ACTION_FAILED',
};

export const setUserProfileAction = profile => {
  return action(UserActions.SET_PROFILE, profile);
};

/* #region getUserProfile */
export const getUserProfileAction = payload => {
  return action(UserActions.GET_USER_PROFILE, payload);
};

export const isLoadingUserProfileAction = () => {
  return action(UserActions.IS_LOADING_USER_PROFILE);
};

export const getUserProfileSuccessAction = data => {
  return action(UserActions.ACTION_SUCCEED, data, UserActions.GET_USER_PROFILE);
};

export const getUserProfileFailureAction = error => {
  return action(UserActions.ACTION_FAILED, error, UserActions.GET_USER_PROFILE);
};
/* end region */

export const updateUserProfileSuccessAction = data => {
  return action(UserActions.ACTION_SUCCEED, data, UserActions.UPDATE_USER_PROFILE);
};

export const showEnable2FAFormAction = () => {
  return action(UserActions.SHOW_2FA_ENABLE_FORM);
};

export const showDisable2FAFormAction = () => {
  return action(UserActions.SHOW_2FA_DISABLE_FORM);
};

/* #region enable 2FA */
export const enable2FAAction = () => {
  return action(UserActions.ENABLE_2FA);
};

export const isEnabling2FAAction = () => {
  return action(UserActions.IS_UPDATING_2FA);
};

export const enable2FASuccessAction = data => {
  return action(UserActions.ACTION_SUCCEED, data, UserActions.ENABLE_2FA);
};

export const enable2FAFailureAction = error => {
  return action(UserActions.ACTION_FAILED, error, UserActions.ENABLE_2FA);
};
/* #endregion */

/* #region confirm 2FA */
export const confirm2FAAction = data => {
  return action(UserActions.CONFIRM_2FA, data);
};

export const isConfirming2FAAction = () => {
  return action(UserActions.IS_UPDATING_2FA);
};

export const confirm2FASuccessAction = data => {
  return action(UserActions.ACTION_SUCCEED, data, UserActions.CONFIRM_2FA);
};

export const confirm2FAFailureAction = error => {
  return action(UserActions.ACTION_FAILED, error, UserActions.CONFIRM_2FA);
};
/* #endregion */

/* #region disable 2FA */
export const disable2FAAction = data => {
  return action(UserActions.DISABLE_2FA, data);
};

export const isDisabling2FAAction = () => {
  return action(UserActions.IS_UPDATING_2FA);
};

export const disable2FASuccessAction = data => {
  return action(UserActions.ACTION_SUCCEED, data, UserActions.DISABLE_2FA);
};

export const disable2FAFailureAction = error => {
  return action(UserActions.ACTION_FAILED, error, UserActions.DISABLE_2FA);
};
/* #endregion */
