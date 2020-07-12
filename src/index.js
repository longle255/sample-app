import 'antd/lib/style/index.less'; // antd core styles
import './components/kit/vendors/antd/themes/default.less'; // default theme antd components
import './components/kit/vendors/antd/themes/dark.less'; // dark theme antd components
import './global.scss'; // app & third-party component styles

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as serviceWorker from './serviceWorker';
import Router from './router';
import Localization from './localization';
import { store, history } from './store';

ReactDOM.render(
  <Provider store={store}>
    <Localization>
      <Router history={history} />
    </Localization>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export { store, history };
