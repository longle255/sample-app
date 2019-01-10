import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { pendingTasksReducer } from 'react-redux-spinner'

export default (history) => combineReducers({
  router: connectRouter(history),
  pendingTasks: pendingTasksReducer,
})