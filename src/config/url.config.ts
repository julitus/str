// true: DEVELOPMENT, false: PRODUCTION

var DEV = false;

export const URL_ROOT = (DEV ? 'http://192.168.1.6/apalabra' : '...');
export const URL_SERVICES = URL_ROOT + '/api';
