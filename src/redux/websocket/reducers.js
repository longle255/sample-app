const initialState = {};

export function websocketReducer(state = initialState, action) {
  switch (action.type) {
    case 'message':
      console.log('action', action);
      return Object.assign({}, { message: action.data });
    default:
      return state;
  }
}
