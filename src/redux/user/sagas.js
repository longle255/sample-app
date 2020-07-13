import { all, takeEvery, put, call } from 'redux-saga/effects';
import { profileService } from 'services';
import { history } from 'index';
import { APP_URLS } from 'constants/APP_URLS';

import {
  UserActions,
  isLoadingUserProfileAction,
  getUserProfileSuccessAction,
  getUserProfileFailureAction,
} from './actions';

export function* getUserProfile() {
  try {
    yield put(isLoadingUserProfileAction());
    const result = yield call([profileService, 'getUserProfile']);
    if (result) {
      yield put(getUserProfileSuccessAction(result));
    } else {
      throw new Error('Error while getReferrals');
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

/* end region */

export default function* rootSaga() {
  yield all([
    takeEvery(UserActions.GET_USER_PROFILE, getUserProfile),
    takeEvery(UserActions.SHOW_2FA_ENABLE_FORM, showEnable2FAForm),
    takeEvery(UserActions.SHOW_2FA_ENABLE_FORM, showDisable2FAForm),
  ]);
}
