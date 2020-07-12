import { action } from 'typesafe-actions';

export const UserActions = {
  SET_PROFILE: '[USER] SET_PROFILE',

  SAMPLE_ACTION: '[USER] SAMPLE_ACTION',
};

export const setUserProfileAction = profile => {
  return action(UserActions.SET_PROFILE, profile);
};
