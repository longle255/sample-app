import { AppActions } from './actions';

const initialState = {
  // APP STATE
  from: '',
  isUpdatingContent: false,
  isLoading: false,
  activeDialog: '',
  dialogForms: {},
  submitForms: {},
  isHideLogin: false,

  // LAYOUT STATE
  layoutState: {
    isMenuTop: false,
    menuMobileOpened: false,
    menuCollapsed: false,
    menuShadow: true,
    themeLight: false,
    squaredBorders: false,
    borderLess: true,
    fixedWidth: false,
    settingsOpened: false,
  },

  // USER STATE
  userState: {
    email: '',
    role: '',
  },
};

export function appReducer(state = initialState, action) {
  const data = action.payload;
  let id;

  switch (action.type) {
    case AppActions.SET_FROM:
      return { ...state, from: data };

    case AppActions.SET_LOADING:
      return { ...state, isLoading: data };

    case AppActions.SET_HIDE_LOGIN:
      return { ...state, isHideLogin: data };

    case AppActions.SET_UPDATING_CONTENT:
      return { ...state, isUpdatingContent: data };

    case AppActions.SET_USER_STATE:
      return { ...state, userState: data };

    case AppActions.SET_LAYOUT_STATE:
      const param = data;
      const layoutState = { ...state.layoutState, ...param };
      const newState = { ...state, layoutState };

      return newState;

    case AppActions.SET_ACTIVE_DIALOG:
      const activeDialog = data;
      const result = { ...state, activeDialog };
      if (activeDialog !== '') {
        const id = activeDialog;
        result.dialogForms = { ...state.dialogForms, [id]: true };
      }
      return result;

    case AppActions.DELETE_DIALOG_FORM:
      id = data;
      const dialogForms = { ...state.dialogForms };
      delete dialogForms[id];
      return { ...state, dialogForms };

    case AppActions.ADD_SUBMIT_FORM:
      id = data;
      let submitForms = { ...state.submitForms, [id]: true };
      return { ...state, submitForms };

    case AppActions.DELETE_SUBMIT_FORM:
      id = data;
      submitForms = { ...state.submitForms };
      delete submitForms[id];
      return { ...state, submitForms };

    case AppActions.ACTION_SUCCEED:
      return actionSuccessReducer(state, action);

    case AppActions.ACTION_FAILED:
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
    default:
      return {
        ...state,
        stateErrors: errors,
      };
  }
}
