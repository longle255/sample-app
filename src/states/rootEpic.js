import { combineEpics } from 'redux-observable';
import { getUserProfileEpic } from './auth';
import { getMenuDataEpic } from './menu';

export default combineEpics(getUserProfileEpic);
