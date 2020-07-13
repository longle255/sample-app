import countries from 'constants/countries.json';
import { UserActions } from './actions';

const initialState = {
  profile: null,
  role: null,
  countries,
  twoFA: null,
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case UserActions.SET_PROFILE:
      return { ...state, profile: { ...action.payload }, role: action.payload.role };

    case UserActions.IS_LOADING_USER_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          isLoading: true,
          isLoadedData: false,
        },
      };

    case UserActions.IS_UPDATING_2FA:
      return {
        ...state,
        twoFA: {
          ...state.twoFA,
          isLoading: true,
          isLoadedData: false,
        },
      };

    case UserActions.ACTION_SUCCEED:
      return actionSuccessReducer(state, action);

    case UserActions.ACTION_FAILED:
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
    case UserActions.ENABLE_2FA:
      return {
        ...state,
        twoFA: {
          ...state.twoFA,
          ...data,
          isLoading: false,
          isLoadedData: true,
          stateErrors: {},
        },
      };
    case UserActions.CONFIRM_2FA:
      return {
        ...state,
        twoFA: {
          ...state.twoFA,
          isLoading: false,
          isLoadedData: true,
          stateErrors: {},
        },
        profile: {
          ...state.profile,
          twoFAEnabled: true,
        },
      };
    case UserActions.DISABLE_2FA:
      return {
        ...state,
        twoFA: {
          ...state.twoFA,
          isLoading: false,
          isLoadedData: true,
          stateErrors: {},
        },
        profile: {
          ...state.profile,
          twoFAEnabled: false,
        },
      };

    case UserActions.GET_USER_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...data,
          isLoading: false,
          isLoadedData: true,
        },
        role: data.role,
      };

    case UserActions.UPDATE_USER_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
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
    case UserActions.ENABLE_2FA:
      return {
        ...state,
        twoFA: {
          ...state.twoFA,
          isLoading: false,
          isLoadedData: true,
          stateErrors: errors,
        },
      };

    case UserActions.CONFIRM_2FA:
      return {
        ...state,
        twoFA: {
          ...state.twoFA,
          isLoading: false,
          isLoadedData: true,
          stateErrors: errors,
        },
      };

    case UserActions.DISABLE_2FA:
      return {
        ...state,
        twoFA: {
          ...state.twoFA,
          isLoading: false,
          isLoadedData: true,
          stateErrors: errors,
        },
      };

    case UserActions.GET_USER_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
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
