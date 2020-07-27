import { MicroframeworkLoader } from 'microframework-w3tec';
import { configure, format, transports } from 'winston';

import { env } from '../env';

const _format = (): any => {
  if (env.isProduction) return format.combine(format.colorize(), format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }), format.padLevels(), format.printf(info => `${info.timestamp}|${info.level}${info.message}`));

  return format.combine(format.colorize(), format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }), format.padLevels(), format.printf(info => `${info.timestamp}|${info.level}${info.message}`))
};

export const winstonLoader: MicroframeworkLoader = () => {
  configure({
    transports: [
      new transports.Console({
        level: env.log.level,
        handleExceptions: true,
        format: _format(),
      }),
    ],
  });
};
