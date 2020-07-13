import { AuthActions } from 'redux/auth';
import { ReferralActions } from './actions';

const initialState = {
  referrals: null,
  referralBonuses: null,
  referralWithdrawals: null,
};

export function referralsReducer(state = initialState, action) {
  const data = action.payload;

  switch (action.type) {
    case AuthActions.LOGOUT:
      return {
        ...initialState,
      };

    case ReferralActions.IS_LOADING_REFERRALS:
      return {
        ...state,
        referrals: {
          ...state.referrals,
          ...data,
          isLoading: true,
          isLoadedData: false,
        },
      };

    case ReferralActions.IS_LOADING_REFERRAL_BONUSES:
      return {
        ...state,
        referralBonuses: {
          ...state.referralBonuses,
          ...data,
          isLoading: true,
          isLoadedData: false,
        },
      };

    case ReferralActions.IS_LOADING_WITHDRAWALS:
      return {
        ...state,
        referralWithdrawals: {
          ...state.referralWithdrawals,
          ...data,
          isLoading: true,
          isLoadedData: false,
        },
      };

    case ReferralActions.ACTION_SUCCEED:
      return actionSuccessReducer(state, action);

    case ReferralActions.ACTION_FAILED:
      return actionFailReducer(state, action);

    default:
      return state;
  }
}

function actionSuccessReducer(state, action) {
  const data = action.payload;
  const subType = action.meta;
  state.stateErrors = {};

  switch (subType) {
    case ReferralActions.GET_REFERRALS:
      return {
        ...state,
        referrals: {
          ...state.referrals,
          ...data,
          isLoading: false,
          isLoadedData: true,
          stateErrors: {},
        },
      };

    case ReferralActions.GET_REFERRAL_BONUSES:
      return {
        ...state,
        referralBonuses: {
          ...state.referralBonuses,
          ...data,
          isLoading: false,
          isLoadedData: true,
          stateErrors: {},
        },
      };

    case ReferralActions.GET_WITHDRAWALS:
      return {
        ...state,
        referralWithdrawals: {
          ...state.referralWithdrawals,
          ...data,
          isLoading: false,
          isLoadedData: true,
          stateErrors: {},
        },
      };

    default:
      return state;
  }
}

function actionFailReducer(state, action) {
  const err = action.payload;
  const subType = action.meta;
  const errors = { ...state.stateErrors };
  errors[subType] = err;

  switch (subType) {
    case ReferralActions.GET_REFERRALS:
      return {
        ...state,
        referrals: {
          ...state.referrals,
          isLoading: false,
          isLoadedData: false,
          stateErrors: errors,
        },
      };

    case ReferralActions.GET_REFERRAL_BONUSES:
      return {
        ...state,
        referralBonuses: {
          ...state.referralBonuses,
          isLoading: false,
          isLoadedData: false,
          stateErrors: errors,
        },
      };

    case ReferralActions.GET_WITHDRAWALS:
      return {
        ...state,
        referralWithdrawals: {
          ...state.referralWithdrawals,
          isLoading: false,
          isLoadedData: false,
          stateErrors: errors,
        },
      };

    default:
      return {
        ...state,
        stateErrors: errors,
      };
  }
}
