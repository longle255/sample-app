import configureStore from './redux/configureStore';

const initialState = {};

export const { store, history } = configureStore(initialState);
