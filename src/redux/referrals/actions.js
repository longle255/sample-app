import { action } from 'typesafe-actions';

export const ReferralActions = {
  GET_REFERRALS: '[REFERAL_ACTIONS] GET_REFERRALS',
  IS_LOADING_REFERRALS: '[REFERAL_ACTIONS] IS_LOADING_REFERRALS',

  GET_REFERRAL_BONUSES: '[REFERAL_ACTIONS] GET_REFERRAL_BONUSES',
  IS_LOADING_REFERRAL_BONUSES: '[REFERAL_ACTIONS] IS_LOADING_REFERRAL_BONUSES',

  GET_WITHDRAWALS: '[REFERAL_ACTIONS] GET_WITHDRAWALS',
  IS_LOADING_WITHDRAWALS: '[REFERAL_ACTIONS] IS_LOADING_WITHDRAWALS',

  ACTION_SUCCEED: '[REFERAL_ACTIONS] ACTION_SUCCEED',
  ACTION_FAILED: '[REFERAL_ACTIONS] ACTION_FAILED',
};

/* #region get referrers */
export const getReferralsAction = model => {
  return action(ReferralActions.GET_REFERRALS, model);
};

export const isLoadingReferralsAction = data => {
  return action(ReferralActions.IS_LOADING_REFERRALS, data);
};

export const getReferralsSuccessAction = data => {
  return action(ReferralActions.ACTION_SUCCEED, data, ReferralActions.GET_REFERRALS);
};

export const getReferralsFailureAction = error => {
  return action(ReferralActions.ACTION_FAILED, error, ReferralActions.GET_REFERRALS);
};
/* #endregion */

/* #region get bonus */
export const getReferralBonusesAction = model => {
  return action(ReferralActions.GET_REFERRAL_BONUSES, model);
  // return async (dispatch, getState) => {
  //   dispatch(isLoadingReferralBonusesAction(model));

  //   try {
  //     const result = await referralService.getBonuses(model);
  //     const data = {
  //       ...model,
  //       pagination: {
  //         ...model.pagination,
  //         total: result.total,
  //       },
  //       data: result.data,
  //     };

  //     dispatch(getReferralBonusesSuccessAction(data));
  //   } catch (error) {
  //     dispatch(getReferralBonusesFailureAction(error));
  //   }
  // };
};

export const isLoadingReferralBonusesAction = data => {
  return action(ReferralActions.IS_LOADING_REFERRAL_BONUSES, data);
};

export const getReferralBonusesSuccessAction = data => {
  return action(ReferralActions.ACTION_SUCCEED, data, ReferralActions.GET_REFERRAL_BONUSES);
};

export const getReferralBonusesFailureAction = error => {
  return action(ReferralActions.ACTION_FAILED, error, ReferralActions.GET_REFERRAL_BONUSES);
};
/* #endregion */

/* #region Get Referral Withdrawal */
export const getReferralWithdrawalsAction = model => {
  return action(ReferralActions.GET_WITHDRAWALS, model);
  // return async (dispatch, getState) => {
  //   dispatch(isLoadingReferralWithdrawalsAction(model));
  //   try {
  //     const result = await referralService.getWithdrawals(model);
  //     const data = {
  //       ...model,
  //       pagination: {
  //         ...model.pagination,
  //         total: result.total,
  //       },
  //       data: result.data,
  //     };
  //     dispatch(getReferralWithdrawalsSuccessAction(data));
  //   } catch (error) {
  //     dispatch(getReferralWithdrawalsFailureAction(error));
  //   }
  // };
};

export const isLoadingReferralWithdrawalsAction = data => {
  return action(ReferralActions.IS_LOADING_WITHDRAWALS, data);
};

export const getReferralWithdrawalsSuccessAction = data => {
  return action(ReferralActions.ACTION_SUCCEED, data, ReferralActions.GET_WITHDRAWALS);
};

export const getReferralWithdrawalsFailureAction = error => {
  return action(ReferralActions.ACTION_FAILED, error, ReferralActions.GET_WITHDRAWALS);
};
/* #endregion */
