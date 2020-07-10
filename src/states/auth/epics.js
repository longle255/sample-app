import { ofType } from 'redux-observable';
import { profileService } from 'services';
import { action } from 'typesafe-actions';
import { map, catchError, switchMap, throttleTime } from 'rxjs/operators';
import {
  AuthActions,
  isLoadingUserProfileAction,
  getUserProfileSuccessAction,
  getUserProfileFailureAction,
} from './actions';

export const getUserProfileEpic = action$ =>
  action$.pipe(
    ofType(AuthActions.GET_USER_PROFILE),
    throttleTime(1500),
    switchMap(() => {
      isLoadingUserProfileAction();

      return profileService.getUserProfile();
    }),
    map(result => getUserProfileSuccessAction(result)),
    catchError(error => getUserProfileFailureAction(error)),
  );
