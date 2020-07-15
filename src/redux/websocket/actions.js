// import { action } from 'typesafe-actions';
import { appConfig } from 'config';

export const WebsocketActions = {
  PING: '[SOCKET] PING',
};

export const sendPingAction = data => {
  return { type: `${appConfig.wsActionPrefix}/hello`, data };
};
