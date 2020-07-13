import { all, takeEvery, put, call } from 'redux-saga/effects';
import { profileService, notificationService } from 'services';
import { history } from 'index';
import { APP_URLS } from 'constants/APP_URLS';

import {
  UserActions,
  isLoadingUserProfileAction,
  getUserProfileSuccessAction,
  getUserProfileFailureAction,
  isEnabling2FAAction,
  enable2FAFailureAction,
  enable2FASuccessAction,
  isConfirming2FAAction,
  confirm2FASuccessAction,
  confirm2FAFailureAction,
  disable2FASuccessAction,
  disable2FAFailureAction,
} from './actions';

export function* getUserProfile() {
  try {
    yield put(isLoadingUserProfileAction());
    const result = yield call([profileService, 'getUserProfile']);
    if (result) {
      yield put(getUserProfileSuccessAction(result));
    } else {
      throw new Error('Error while getUserProfile');
    }
  } catch (error) {
    yield put(getUserProfileFailureAction(error));
  }
}

/* #region 2FA */
export function* showEnable2FAForm() {
  const url = `${APP_URLS.settings_2FA}?state=enable`;
  yield history.push(url);
}

export function* showDisable2FAForm() {
  const url = `${APP_URLS.settings_2FA}?state=disable`;
  yield history.push(url);
}

export function* enable2FA() {
  try {
    yield put(isEnabling2FAAction());
    const result = yield call([profileService, 'enable2FA']);
    if (result) {
      yield put(enable2FASuccessAction(result));
    } else {
      throw new Error('Error while enable2FA');
    }
  } catch (error) {
    yield put(enable2FAFailureAction(error));
  }
}

export function* confirm2FA(data) {
  try {
    yield put(isConfirming2FAAction());
    const result = yield call([profileService, 'confirm2FA'], data.payload);
    if (result) {
      yield put(confirm2FASuccessAction(result));
      yield history.push(APP_URLS.settings_2FA);
      notificationService.showSuccessMessage(
        'Two-factors authentication enabled!',
        'Two-factor auth',
      );
    } else {
      throw new Error('Error while confirm2FA');
    }
  } catch (error) {
    yield put(confirm2FAFailureAction(error));
  }
}

export function* disable2FA(data) {
  try {
    yield put(isConfirming2FAAction());
    const result = yield call([profileService, 'disable2FA'], data.payload);
    if (result) {
      yield put(disable2FASuccessAction(result));
      yield history.push(APP_URLS.settings_2FA);
      notificationService.showSuccessMessage(
        'Two-factors authentication disabled!',
        'Two-factor auth',
      );
    } else {
      throw new Error('Error while disable2FA');
    }
  } catch (error) {
    yield put(disable2FAFailureAction(error));
  }
}

/* end region */

export default function* rootSaga() {
  yield all([
    takeEvery(UserActions.GET_USER_PROFILE, getUserProfile),
    takeEvery(UserActions.SHOW_2FA_ENABLE_FORM, showEnable2FAForm),
    takeEvery(UserActions.SHOW_2FA_DISABLE_FORM, showDisable2FAForm),
    takeEvery(UserActions.ENABLE_2FA, enable2FA),
    takeEvery(UserActions.CONFIRM_2FA, confirm2FA),
    takeEvery(UserActions.DISABLE_2FA, disable2FA),
  ]);
}
