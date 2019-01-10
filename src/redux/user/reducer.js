import actions from "./actions";

const initialState = {
  id: '',
  name: '',
  role: '',
  email: '',
  avatar: '',
  authorized: false,
}

export default SET_STATE = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE: 
      return { ...state, ...action.payload }
    default: 
      return state
  }
}