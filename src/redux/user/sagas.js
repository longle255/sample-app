import { all, takeEvery } from 'redux-saga/effects';
import { UserActions } from './actions';

export function* sampleAction({ payload }) {
  yield console.log(payload);
}

export default function* rootSaga() {
  yield all([takeEvery(UserActions.SAMPLE_ACTION, sampleAction)]);
}
