import Boot from './states/boot';
import configureStore from './states/configureStore';

const initialState = {};

export const { store, history } = configureStore(initialState);

Boot(store)
  .then(() => {
    console.log('Booted');
  })
  .catch(error => console.error(error));
