import { all, takeEvery, put, call } from 'redux-saga/effects';
import { referralService } from 'services';

import {
  ReferralActions,
  isLoadingReferralsAction,
  getReferralsSuccessAction,
  getReferralsFailureAction,
} from './actions';

export function* getReferrals(action) {
  try {
    yield put(isLoadingReferralsAction());
    const model = action.payload;
    const result = yield call([referralService, 'getReferrals'], model);
    if (result) {
      const data = {
        ...model,
        pagination: {
          ...model.pagination,
          total: result.total,
        },
        data: result.data,
      };
      yield put(getReferralsSuccessAction(data));
    } else {
      throw new Error('Error while getReferrals');
    }
  } catch (error) {
    yield put(getReferralsFailureAction(error));
  }
}

export default function* rootSaga() {
  yield all([takeEvery(ReferralActions.GET_REFERRALS, getReferrals)]);
}
