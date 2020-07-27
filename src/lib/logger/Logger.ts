import * as path from 'path';
import { format, formatWithOptions } from 'util';
import * as winston from 'winston';

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

  private log(level: string, message: any, args: any[]): void {
    if (LOG_LEVEL[level] > LOG_LEVEL[env.log.level]) {
      return;
    }

    const formattedArgs = env.isProduction ? format(message, args) : formatWithOptions({ colors: true }, message, args);

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
