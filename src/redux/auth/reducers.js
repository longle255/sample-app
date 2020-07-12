import { AuthActions } from './actions';

const initialState = {
  isLoading: false,
  success: null,
  stateErrors: null,
};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case AuthActions.IS_LOGGING_IN:
      return { ...state, isLoading: true };
    case AuthActions.SET_STATE:
      return { ...state, ...action.payload };

    case AuthActions.CLEAN_UP:
      return { ...state, stateErrors: null, success: false, isLoading: false };

    case AuthActions.ACTION_SUCCEED:
      return actionSuccessReducer(state, action);

    case AuthActions.ACTION_FAILED:
      return actionFailReducer(state, action);
    default:
      return state;
  }
}

function actionSuccessReducer(state, action) {
  const subType = action.meta;
  state.stateErrors = {};

  switch (subType) {
    case AuthActions.SIGN_IN:
      return {
        ...state,
        isLoading: false,
        success: true,
        stateErrors: null,
      };
    case AuthActions.SIGN_UP:
      return {
        ...state,
        isLoading: false,
        success: true,
        stateErrors: null,
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
    case AuthActions.SIGN_IN:
      return {
        ...state,
        isLoading: false,
        success: false,
        stateErrors: errors,
      };
    case AuthActions.SIGN_UP:
      return {
        ...state,
        isLoading: false,
        success: false,
        stateErrors: errors,
      };

    default:
      return {
        ...state,
        stateErrors: errors,
      };
  }
}
