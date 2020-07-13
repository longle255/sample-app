import { pendingTasksReducer } from 'react-redux-spinner';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { userReducer } from './user';
import { settingsReducer } from './settings';
import { authReducer } from './auth';
import { referralsReducer } from './referrals';

export const createRootReducer = history =>
  combineReducers({
    pendingTasks: pendingTasksReducer,
    router: connectRouter(history),
    user: userReducer,
    settings: settingsReducer,
    auth: authReducer,
    referrals: referralsReducer,
  });
