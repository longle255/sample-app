import { action } from 'typesafe-actions';

export const UserActions = {
  SET_PROFILE: '[USER] SET_PROFILE',

  GET_USER_PROFILE: '[USER] GET_USER_PROFILE',

  IS_LOADING_USER_PROFILE: '[USER] IS_LOADING_USER_PROFILE',

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
