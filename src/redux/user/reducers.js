import { UserActions } from './actions';

const initialState = {
  profile: null,
  role: null,
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case UserActions.SET_PROFILE:
      return { ...state, profile: { ...action.payload }, role: action.payload.role };
    default:
      return state;
  }
}
