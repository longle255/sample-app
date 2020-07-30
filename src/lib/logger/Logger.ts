import * as path from 'path';
import { format as formatUtil, formatWithOptions } from 'util';
import * as winston from 'winston';
import { format as format, transports } from 'winston';

import { env } from '../../env';
import { paddingRight } from '../../utils';

/**
 * core.Log
 * ------------------------------------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 *
 * By Default it uses the debug-adapter, but you are able to change
 * this in the start up process in the core/index.ts file.
 */

const LOG_LEVEL = {
  silly: 6,
  debug: 5,
  verbose: 4,
  info: 3,
  warn: 2,
  error: 1,
};


const _format = (): any => {

  if (env.isProduction) return format.combine(format.colorize(), format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }), format.padLevels(), format.printf(info => `${info.timestamp}|${info.level}${info.message}`));

  return format.combine(format.colorize(), format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }), format.padLevels(), format.printf(info => {
    let msg: string;
    if (info.durationMs || info.durationMs===0) {
      msg = `    |profiling| Performing [${info.message.trim()}] in [${info.durationMs}] milisec`
    } else {
      msg = info.message;
    }
    return `${info.timestamp}|${info.level}${msg}`}))
};

export const consoleTransport = new transports.Console({
  level: env.log.level,
  handleExceptions: true,
  // format: env.node !== 'development' ? format.combine(format.json()) : format.combine(format.colorize(), format.simple()),
  format: _format(),
  silent: env.isTest
});


export class Logger {

  public winston= winston;

  public static DEFAULT_SCOPE = 'app';

  private static parsePathToScope(filepath: string): string {
    if (filepath.indexOf(path.sep) >= 0) {
      filepath = filepath.replace(process.cwd(), '');
      filepath = filepath.replace(`${path.sep}src${path.sep}`, '');
      filepath = filepath.replace(`${path.sep}dist${path.sep}`, '');
      filepath = filepath.replace('.ts', '');
      filepath = filepath.replace('.js', '');
      filepath = filepath.replace(path.sep, ':');
      filepath = filepath.replace(/Service|Controller|Middleware/, '');
    }
    return filepath;
  }

  private scope: string;

  private winston: winston.Logger;

  constructor(scope?: string) {
    this.scope = Logger.parsePathToScope(scope ? scope : Logger.DEFAULT_SCOPE);
  }

  public debug(message: string, ...args: any[]): void {
    this.log('debug', message, args);
  }

  public verbose(message: string, ...args: any[]): void {
    this.log('verbose', message, args);
  }

  public silly(message: string, ...args: any[]): void {
    this.log('silly', message, args);
  }

  public info(message: string, ...args: any[]): void {
    this.log('info', message, args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log('warn', message, args);
  }

  public error(message: any, ...args: any[]): void {
    this.log('error', message, args);
  }

  public getWinston(): winston.Logger {
    if (!this.winston) this.winston = winston.createLogger({transports: consoleTransport});
    return this.winston;
  }

  private log(level: string, message: any, args: any[]): void {
    if (LOG_LEVEL[level] > LOG_LEVEL[env.log.level]) {
      return;
    }

    const formattedArgs = env.isProduction ? formatUtil(message, args) : formatWithOptions({ colors: true }, message, args);

    if (winston) {
      winston[level](
        `${this.formatScope()} ${args.length ? formattedArgs : message instanceof Error ? message.stack : message}`,
      );
    }
  }

  private formatScope(): string {
    return `|${paddingRight(this.scope, ' ', 23)}|`;
  }
}
