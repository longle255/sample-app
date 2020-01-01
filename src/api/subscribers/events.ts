import { User } from '../models/User';

/**
 * events
 * ---------------------
 * Define all your possible custom events here.
 */
export const events = {
    [User.modelName]: {
        created: 'onUserCreate',
    },
};
