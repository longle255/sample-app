import { all } from 'redux-saga/effects';
import user from './user/sagas';
import settings from './settings/sagas';
import auth from './auth/sagas';

export function* rootSaga() {
  yield all([auth(), user(), settings()]);
}
