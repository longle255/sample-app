import { ofType } from 'redux-observable';
import { action } from 'typesafe-actions';
import { map, debounceTime } from 'rxjs/operators';
import { MenuActions } from './actions';

export const getMenuDataEpic = action$ =>
  action$.pipe(
    ofType(MenuActions.GET_MENU_DATA),
    debounceTime(350),
    map(act => {
      return action(MenuActions.ACTION_SUCCEED, act.payload, MenuActions.GET_MENU_DATA);
    }),
  );
