import { pendingTasksReducer } from 'react-redux-spinner';
import { connectRouter } from 'connected-react-router';

import { combineReducers } from 'redux';
import { appReducer } from './app';
import { authReducer } from './auth';
import { sampleReducer } from './sample';
import { settingReducer } from './settings';
import { menuReducer } from './menu';

export const createRootReducer = history =>
  combineReducers({
    app: appReducer,
    router: connectRouter(history),
    pendingTasks: pendingTasksReducer,
    auth: authReducer,
    menu: menuReducer,
    sample: sampleReducer,
    settings: settingReducer,
  });
