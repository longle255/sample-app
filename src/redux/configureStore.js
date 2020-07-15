import io from 'socket.io-client';
import createSocketIoMiddleware from 'redux-socket.io';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { appConfig } from 'config';
import { gaMiddleware } from './analytics';
import { createRootReducer } from './reducers';
import { rootSaga } from './sagas';
import { history } from './createHistory';

export default function configureStore(initialState) {
  const socket = io(process.env.WS_URI);
  const socketIoMiddleware = createSocketIoMiddleware(socket, appConfig.wsActionPrefix);
  // middlewares
  const sagaMiddleware = createSagaMiddleware();
  const routeMiddleware = routerMiddleware(history);
  const middlewares = [gaMiddleware, sagaMiddleware, routeMiddleware, socketIoMiddleware];

  if (process.env.NODE_ENV === 'development') {
    const logger = createLogger({
      predicate: (getState, action) => action.type !== '@@router/LOCATION_CHANGE', // do not log actions of router
      collapsed: (getState, action) => action.type, // collapse on all actions
    });
    middlewares.push(logger);
  }

  const store = createStore(
    createRootReducer(history),
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares)),
  );

  sagaMiddleware.run(rootSaga);
  return { store, history };
}
