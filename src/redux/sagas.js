import { all } from 'redux-saga/effects';
import user from './user/sagas';
import settings from './settings/sagas';
import auth from './auth/sagas';
import referrals from './referrals/sagas';
import websocket from './websocket/sagas';

export function* rootSaga() {
  yield all([auth(), user(), settings(), referrals(), websocket()]);
}
