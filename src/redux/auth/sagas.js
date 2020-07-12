import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import { history } from 'index';
import { StorageService, authService, profileService } from 'services';
import { setUserProfileAction } from 'redux/user';
import { APP_URLS } from 'constants/APP_URLS';
import {
  AuthActions,
  isLoadingAction,
  signInSuccessAction,
  signInFailureAction,
  signUpSuccessAction,
  signUpFailureAction,
  loadCurrentUserAction,
  signOutAction,
} from './actions';

const APP_USER_KEY = StorageService.USER_INFO_KEY;

export function* signIn({ payload }) {
  yield put(isLoadingAction());
  try {
    const { rememberMe } = payload;
    delete payload.rememberMe;
    const result = yield call([authService, 'logIn'], payload);
    if (result) {
      StorageService.setToken(result.access_token);
      if (rememberMe) {
        StorageService.setRefreshToken(result.refresh_token);
        StorageService.setAuthEmail(result.profile.email);
      }
      StorageService.setData(APP_USER_KEY, result.profile);

      // Set the user ID for GA
      if (window.ga) {
        const userId = result.profile.id;
        window.ga('set', 'userId', userId);
      }
      yield put(loadCurrentUserAction(result));
      yield put(signInSuccessAction(result));
      notification.success({
        message: 'Logged In',
        description: 'You have successfully logged in!',
      });
    }
  } catch (error) {
    const errorMessage = error.message;
    const isNeedToVerifyEmail =
      errorMessage ===
      'Please confirm your email address by clicking the confirmation link in your email';
    const isWrongToken = errorMessage === 'Incorrect two-factor authentication token';
    const isShown2FAForm = errorMessage === 'Missing two-factor authentication token';

    yield put(
      signInFailureAction({ isNeedToVerifyEmail, isWrongToken, errorMessage, isShown2FAForm }),
    );
  }
}

export function* signUp({ payload }) {
  yield put(isLoadingAction());
  try {
    const result = yield call([authService, 'registerNewUser'], payload);
    if (result) {
      yield put(signUpSuccessAction(result));
    }
  } catch (error) {
    const errorMessage = error.message;
    yield put(signUpFailureAction({ errorMessage }));
  }
}

export function* loadCurrentUser() {
  try {
    if (!StorageService.getToken()) {
      return;
    }
    yield put(isLoadingAction());
    const result = yield call([profileService, 'getUserProfile']);
    if (result) {
      yield put(signInSuccessAction(result));
      yield put(setUserProfileAction(result));
      yield history.push('/');
    }
  } catch (error) {
    const errorMessage = error.message;
    yield put(signInFailureAction({ errorMessage }));
  }
}

export function* signOut() {
  StorageService.removeToken();
  StorageService.removeData(APP_USER_KEY);
  yield history.push(APP_URLS.login);
  yield put(setUserProfileAction({}));
  yield put(signOutAction());
}

export default function* rootSaga() {
  yield all([
    takeEvery(AuthActions.SIGN_IN, signIn),
    takeEvery(AuthActions.SIGN_UP, signUp),
    takeEvery(AuthActions.LOAD_CURRENT_USER, loadCurrentUser),
    takeEvery(AuthActions.SIGN_OUT, signOut),
    loadCurrentUser(), // run once on app load to check user auth
  ]);
}
