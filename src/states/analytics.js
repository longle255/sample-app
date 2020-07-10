import { LOCATION_CHANGE } from 'connected-react-router';
import { createMiddleware } from 'redux-beacon';
import { StorageService } from 'services';
import once from 'lodash-es/once';
import GoogleAnalytics, { trackEvent, trackPageView } from '@redux-beacon/google-analytics';
import logger from '@redux-beacon/logger';

import { SampleActions } from 'states/sample';
import { EXCLUDING_URLS } from 'constants/APP_URLS';

import { googleConfig } from '../config';

const global = window;
const isEnabledDebugGa = !!googleConfig.isEnabledDebugGa;
const installId = StorageService.getInstallId();

const isIgnoreUrl = locationPathname => {
  if (EXCLUDING_URLS.some(url => url.startsWith(locationPathname))) {
    if (isEnabledDebugGa) console.info("Don't trace page", locationPathname);
    return true;
  }

  return false;
};

const initializeGA = once(location => {
  console.log('initializeGA', location);
  global.ga('create', {
    trackingId: googleConfig.gaTrackingId,
    cookieDomain: 'auto',
    userId: installId,
  });

  global.ga('send', 'pageview');
});

const init = () => {
  if (!googleConfig.gaTrackingId) {
    return;
  }

  // TODO: some cases are missed. Will fix later
  const locationPathname = global.location.pathname;
  if (isIgnoreUrl(locationPathname)) {
    return;
  }

  initializeGA();
};

const emitLocationChanged = trackPageView(action => {
  const { pathname } = action.payload;
  if (isIgnoreUrl(pathname)) {
    return {
      page: 'IGNORE_URL',
    };
  }

  initializeGA();

  return {
    page: pathname,
  };
});

const emitSampleAction = trackEvent(action => ({
  category: 'SAMPLE',
  action: 'ACTION',
  test: action,
}));

// Match the event definition to a Redux action:
const eventsMap = {
  [SampleActions.SAMPLE_ACTION]: emitSampleAction,
  [LOCATION_CHANGE]: emitLocationChanged,
};

init();

// Create the middleware
const ga = GoogleAnalytics();
const gaMiddleware = createMiddleware(eventsMap, ga, {
  logger: isEnabledDebugGa ? logger : null,
});

export default gaMiddleware;
