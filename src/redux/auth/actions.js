import { action } from 'typesafe-actions';

export const AuthActions = {
  SIGN_IN: '[AUTH] SIGN_IN',
  SIGN_OUT: '[AUTH] SIGN_OUT',
  SIGN_UP: '[AUTH] SIGN_UP',
  LOAD_CURRENT_USER: '[AUTH] LOAD_CURRENT_USER',
  CLEAN_UP: '[AUTH] CLEAN_UP',

  IS_LOADING: '[AUTH] IS_LOADING',

  ACTION_SUCCEED: '[AUTH] ACTION_SUCCEED',
  ACTION_FAILED: '[AUTH] ACTION_FAILED',
};

export const signInAction = payload => {
  return action(AuthActions.SIGN_IN, payload);
};

export const isLoadingAction = () => {
  return action(AuthActions.IS_LOADING);
};

export const signInSuccessAction = data => {
  return action(AuthActions.ACTION_SUCCEED, data, AuthActions.SIGN_IN);
};

export const signInFailureAction = error => {
  return action(AuthActions.ACTION_FAILED, error, AuthActions.SIGN_IN);
};

export const cleanAuthErrorAction = () => {
  return action(AuthActions.CLEAN_UP);
};

export const signUpAction = payload => {
  return action(AuthActions.SIGN_UP, payload);
};

export const signUpSuccessAction = data => {
  return action(AuthActions.ACTION_SUCCEED, data, AuthActions.SIGN_UP);
};

export const signUpFailureAction = error => {
  return action(AuthActions.ACTION_FAILED, error, AuthActions.SIGN_UP);
};

export const loadCurrentUserAction = redirect => {
  return action(AuthActions.LOAD_CURRENT_USER, redirect);
};

export const signOutAction = () => {
  return action(AuthActions.SIGN_OUT);
};
