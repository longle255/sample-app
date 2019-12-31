/**
 * Client Failures
 */
export const UNKNOWN_ENDPOINT = {
    code: 'UNKNOWN_ENDPOINT',
    message: 'The requested endpoint does not exist.',
};

export const INVALID_REQUEST = {
    code: 'INVALID_REQUEST',
    message: 'The request has invalid parameters.',
};

/**
 * Server Errors
 */
export const INTERNAL_ERROR = {
    code: 'INTERNAL_ERROR',
    message: 'The server encountered an internal error.',
};

export const UNKNOWN_ERROR = {
    code: 'UNKNOWN_ERROR',
    message: 'The server encountered an unknown error.',
};
