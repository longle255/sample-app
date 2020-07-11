import { pendingTask, begin, end } from 'react-redux-spinner';
import { push } from 'connected-react-router';
import { action } from 'typesafe-actions';
import { authService, StorageService } from 'services';
import { getUserProfileAction, logOutAction } from 'states/auth';
import { APP_URLS, PUBLIC_URLS } from 'services/../constants/APP_URLS';

export const AppActions = {
  SET_FROM: '[APP] SET_FROM',
  SET_LOADING: '[APP] SET_LOADING',
  SET_UPDATING_CONTENT: '[APP] SET_UPDATING_CONTENT',
  SET_ACTIVE_DIALOG: '[APP] SET_ACTIVE_DIALOG',
  DELETE_DIALOG_FORM: '[APP] DELETE_DIALOG_FORM',
  ADD_SUBMIT_FORM: '[APP] ADD_SUBMIT_FORM',
  DELETE_SUBMIT_FORM: '[APP] DELETE_SUBMIT_FORM',
  SET_LAYOUT_STATE: '[APP] SET_LAYOUT_STATE',

  LOGIN: '[APP] LOGIN',
  ACTION_SUCCEED: '[APP] ACTION_SUCCEED',
  ACTION_FAILED: '[APP] ACTION_FAILED',
};

// ACTIONS
export const setFromUrlAction = payload => action(AppActions.SET_FROM, payload);
const setLoadingAction = payload => action(AppActions.SET_LOADING, payload);

export const setUpdatingContent = payload => action(AppActions.SET_UPDATING_CONTENT, payload);

export const setActiveDialog = payload => action(AppActions.SET_ACTIVE_DIALOG, payload);

export const deleteDialogForm = payload => action(AppActions.DELETE_DIALOG_FORM, payload);

export const addSubmitForm = payload => action(AppActions.ADD_SUBMIT_FORM, payload);

export const deleteSubmitForm = payload => action(AppActions.DELETE_SUBMIT_FORM, payload);

export const setLayoutState = payload => action(AppActions.SET_LAYOUT_STATE, payload);

export const setLoading = isLoading => {
  const action = setLoadingAction(isLoading);
  action[pendingTask] = isLoading ? begin : end;
  return action;
};

export const isSearchFileTemplates = (data: any) => {
  return action(AppActions.IS_SEARCH_FILE_TEMPLATES, data);
};
