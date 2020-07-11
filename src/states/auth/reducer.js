import { Map } from 'immutable';
import { AuthActions } from './actions';

const initState = new Map({
  idToken: null,
  userProfile: null,
  countries: null,
});

export function authReducer(state = initState, action) {
  switch (action.type) {
    case AuthActions.LOGOUT:
      return {
        ...initState,
        stateErrors: {},
      };

    case AuthActions.IS_LOGIN:
      return {
        ...initState,
        isLoading: true,
      };

    case AuthActions.IS_LOADING_USER_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          isLoading: true,
          isLoadedData: false,
        },
      };

    case AuthActions.IS_LOADING_COUNTRIES:
      return {
        ...state,
        countries: {
          ...state.countries,
          isLoading: true,
          isLoadedData: false,
        },
      };

    case AuthActions.ACTION_SUCCEED:
      return actionSuccessReducer(state, action);

    case AuthActions.ACTION_FAILED:
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
    case AuthActions.LOGIN_SUCCESS:
      return {
        ...state,
        idToken: data,
      };

    case AuthActions.GET_USER_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...data,
          isLoading: false,
          isLoadedData: true,
          stateErrors: {},
        },
      };

    case AuthActions.UPDATE_USER_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...data,
          stateErrors: {},
        },
      };

    case AuthActions.UPDATE_2FA_STATE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ...data,
          stateErrors: {},
        },
      };

    case AuthActions.GET_COUNTRIES:
      return {
        ...state,
        countries: {
          ...state.countries,
          items: data,
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
    case AuthActions.GET_USER_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          isLoading: false,
          isLoadedData: false,
          stateErrors: errors,
        },
      };

    case AuthActions.GET_COUNTRIES:
      return {
        ...state,
        countries: {
          ...state.countries,
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
