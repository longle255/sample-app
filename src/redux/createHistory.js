import { createBrowserHistory } from 'history';

// Create browser history to use in the Redux store
const baseUrl = window.document.getElementsByTagName('base')[0].getAttribute('href');
const history = createBrowserHistory({ basename: baseUrl });

export { history };
