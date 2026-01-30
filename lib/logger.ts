
import log from 'loglevel';

if (import.meta.env.PROD) {
  log.setLevel('warn');
} else {
  log.setLevel('debug');
}

export const logger = {
  info: (msg: string, data?: any) => log.info(msg, data),
  error: (msg: string, err?: any) => log.error(msg, err),
  warn: (msg: string, data?: any) => log.warn(msg, data),
  debug: (msg: string, data?: any) => log.debug(msg, data),
};
