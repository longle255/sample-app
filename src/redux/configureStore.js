import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { gaMiddleware } from './analytics';
import { createRootReducer } from './reducers';
import { rootSaga } from './sagas';
import { history } from './createHistory';

export default function configureStore(initialState) {
  // middlewares
  const sagaMiddleware = createSagaMiddleware();
  const routeMiddleware = routerMiddleware(history);
  const middlewares = [gaMiddleware, sagaMiddleware, routeMiddleware];

  if (process.env.NODE_ENV === 'development') {
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
