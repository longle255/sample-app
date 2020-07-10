import { action } from 'typesafe-actions';
import { settingService } from 'services';

export const SettingActions = {
  GET_SERVER_SETTING: '[SYSTEM] GET_SERVER_SETTING',
  IS_LOADING_SERVER_SETTING: '[SYSTEM] IS_LOADING_SERVER_SETTING',

  ACTION_SUCCEED: '[SYSTEM] ACTION_SUCCEED',
  ACTION_FAILED: '[SYSTEM] ACTION_FAILED',
};

/* #region get pools */
export const getServerSettingAction = model => {
  return async (dispatch, getState) => {
    dispatch(isLoadingServerSettingAction(model));
    try {
      const result = await settingService.getApiServerSetting(model);
      const data = {
        data: result.data,
      };

      dispatch(getServerSettingSuccessAction(data));
    } catch (error) {
      dispatch(getServerSettingFailureAction(error));
    }
  };
};

export const isLoadingServerSettingAction = data => {
  return action(SettingActions.IS_LOADING_SERVER_SETTING, data);
};

export const getServerSettingSuccessAction = data => {
  return action(SettingActions.ACTION_SUCCEED, data, SettingActions.GET_SERVER_SETTING);
};

export const getServerSettingFailureAction = error => {
  return action(SettingActions.ACTION_FAILED, error, SettingActions.GET_SERVER_SETTING);
};
/* #endregion */
