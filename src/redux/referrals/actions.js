import { action } from 'typesafe-actions';

export const ReferralActions = {
  GET_REFERRALS: '[REFERAL] GET_REFERRALS',
  IS_LOADING_REFERRALS: '[REFERAL] IS_LOADING_REFERRALS',

  GET_REFERRAL_BONUSES: '[REFERAL] GET_REFERRAL_BONUSES',
  IS_LOADING_REFERRAL_BONUSES: '[REFERAL] IS_LOADING_REFERRAL_BONUSES',

  GET_WITHDRAWALS: '[REFERAL] GET_WITHDRAWALS',
  IS_LOADING_WITHDRAWALS: '[REFERAL] IS_LOADING_WITHDRAWALS',

  ACTION_SUCCEED: '[REFERAL] ACTION_SUCCEED',
  ACTION_FAILED: '[REFERAL] ACTION_FAILED',
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
