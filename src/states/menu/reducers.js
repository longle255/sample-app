import { MenuActions } from './actions';
import { menuService } from '../../services';
import { AuthActions } from '../auth/actions';

const initialState = {
  menuData: [],
  isLoading: true,
  isLoadedData: false,
};

export function menuReducer(state = initialState, action) {
  const data = action.payload;

  switch (action.type) {
    case AuthActions.LOGOUT:
      return {
        ...initialState,
      };

    case MenuActions.IS_LOADING_MENU_DATA:
      return {
        ...state,
        menuData: {
          ...state.menuData,
          ...data,
        },
        isLoading: true,
        isLoadedData: false,
      };

    case MenuActions.ACTION_SUCCEED:
      return actionSuccessReducer(state, action);

    case MenuActions.ACTION_FAILED:
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
    case MenuActions.GET_MENU_DATA:
      return {
        ...state,
        menuData: {
          ...data,
        },
        isLoading: false,
        isLoadedData: true,
        stateErrors: {},
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
    case MenuActions.GET_MENU_DATA:
      return {
        ...state,
        menuData: {
          ...state.menuData,
        },
        isLoading: false,
        isLoadedData: false,
        stateErrors: errors,
      };

    default:
      return {
        ...state,
        stateErrors: errors,
      };
  }
}
