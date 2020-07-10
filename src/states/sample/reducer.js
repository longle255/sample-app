import { SampleActions } from './actions';
import { AuthActions } from '../auth/actions';

const initialState = {
  samples: null,
};

export function sampleReducer(state = initialState, action) {
  const data = action.payload;

  switch (action.type) {
    case AuthActions.LOGOUT:
      return {
        ...initialState,
      };

    case SampleActions.IS_LOADING_SAMPLE:
      return {
        ...state,
        samples: {
          ...state.samples,
          ...data,
          isLoading: true,
          isLoadedData: false,
        },
      };

    case SampleActions.ACTION_SUCCEED:
      return actionSuccessReducer(state, action);

    case SampleActions.ACTION_FAILED:
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
    case SampleActions.GET_SAMPLE:
      return {
        ...state,
        samples: {
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
    case SampleActions.GET_SAMPLE:
      return {
        ...state,
        samples: {
          ...state.samples,
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
