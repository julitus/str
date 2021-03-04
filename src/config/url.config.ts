// true: DEVELOPMENT, false: PRODUCTION

var DEV = true;

export const URL_ROOT = (DEV ? 'http://192.168.1.4/apalabra' : '...');
export const URL_SERVICES = URL_ROOT + '/api';
