import { menuService } from 'services';
import { action } from 'typesafe-actions';

export const MenuActions = {
  GET_MENU_DATA: '[MENU] GET_MENU_DATA',

  IS_LOADING_MENU_DATA: '[MENU] IS_LOADING_MENU_DATA',
  SET_STATE: '[MENU] SET_STATE',

  ACTION_SUCCEED: '[MENU] ACTION_SUCCEED',
  ACTION_FAILED: '[MENU] ACTION_FAILED',
};

/* #region get pools */
export const getMenuDataAction = () => {
  return async (dispatch, getState) => {
    dispatch(isLoadingMenuDataAction());
    try {
      const result = await menuService.getMenuData();
      const data = {
        data: result.data,
      };

      dispatch(getMenuDataSuccessAction(data));
    } catch (error) {
      dispatch(getMenuDataFailureAction(error));
    }
  };
};

export const isLoadingMenuDataAction = data => {
  return action(MenuActions.IS_LOADING_MENU_DATA, data);
};

export const getMenuDataSuccessAction = data => {
  return action(MenuActions.ACTION_SUCCEED, data, MenuActions.GET_MENU_DATA);
};

export const getMenuDataFailureAction = error => {
  return action(MenuActions.ACTION_FAILED, error, MenuActions.GET_MENU_DATA);
};
