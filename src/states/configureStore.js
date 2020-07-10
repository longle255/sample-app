import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createEpicMiddleware } from 'redux-observable';
import { appConfig } from '../config';
import history from './createHistory';
import gaMiddleware from './analytics';
import { createRootReducer } from './reducers';
import rootEpic from './rootEpic';

const epicMiddleware = createEpicMiddleware();

// Build middleware. These are functions that can process the actions before they reach the store.
const isDev = !appConfig.production;
const middlewares = [gaMiddleware, epicMiddleware, thunk];

// if (isDev) {
//   const loggerMiddleware = createLogger();
//   middlewares.push(loggerMiddleware);
// }

export default function configureStore(initialState) {
  const store = createStore(
    createRootReducer(history),
    initialState,
    composeWithDevTools(applyMiddleware(routerMiddleware(history), ...middlewares)),
  );

  epicMiddleware.run(rootEpic);

  return { store, history };
}
