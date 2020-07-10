import { pendingTask, begin, end } from 'react-redux-spinner';
import { push } from 'connected-react-router';
import { action } from 'typesafe-actions';
import { authService, StorageService } from 'services';
import { getUserProfileAction, logOutAction } from 'states/auth';
import { APP_URLS, PUBLIC_URLS } from 'services/../constants/APP_URLS';

export const AppActions = {
  SET_FROM: '[APP] SET_FROM',
  SET_LOADING: '[APP] SET_LOADING',
  SET_HIDE_LOGIN: '[APP] SET_HIDE_LOGIN',
  SET_USER_STATE: '[APP] SET_USER_STATE',
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

const APP_USER_KEY = StorageService.USER_INFO_KEY;

// ACTIONS
export const setFromUrlAction = payload => action(AppActions.SET_FROM, payload);
const setLoadingAction = payload => action(AppActions.SET_LOADING, payload);
const setHideLoginAction = payload => action(AppActions.SET_HIDE_LOGIN, payload);

export const setUserState = payload => action(AppActions.SET_USER_STATE, payload);

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

export const resetHideLogin = () => (dispatch, getState) => {
  const state = getState();
  if (state.pendingTasks === 0 && state.app.isHideLogin) {
    dispatch(setHideLoginAction(false));
  }
  return Promise.resolve();
};

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

export const isSearchFileTemplates = (data: any) => {
  return action(AppActions.IS_SEARCH_FILE_TEMPLATES, data);
};

export const loginSuccedAction = (result, fromUrl) => (dispatch, getState) => {
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

export const logout = () => (dispatch, getState) => {
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
