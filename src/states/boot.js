import { getServerSettingAction } from './settings';
import { getMenuDataAction } from './menu';

export default store =>
  new Promise(() => {
    store.dispatch(getMenuDataAction());
    store.dispatch(getServerSettingAction());
  });
