import { RedisClient } from 'redis';
import { Inject, Service } from 'typedi';

import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service({ global: true })
export class CacheService {
  @Inject('redisClient')
  private client: RedisClient;

  constructor(@Logger(__filename) private log: LoggerInterface) {
    this.log.info('Cache service initialized');
  }

  /**
   * Set a value to mem with key
   * @param {String} key   key to set
   * @param {Object} value value to set
   */

  public set(key: string, value: any, ttl?: number): void {
    if (!value) {
      return;
    }
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    key = `cache:${key}`;
    this.client.hmset(key, 'data', value);
    this.client.expire(key, ttl || 3600);
  }

  /**
   * Get a value from mem with key
   * @param {String} key   key to set
   */
  public get(key: string): Promise<any> {
    return new Promise((resolve, reject) =>
      this.client.hgetall(`cache:${key}`, (err, cache) => {
        if (err) {
          return reject(err);
        }
        if (!cache) {
          return resolve();
        }
        try {
          return resolve(JSON.parse(cache.data));
        } catch (e) {
          // cache is not data
          return resolve(cache.data);
        }
      }),
    );
  }
}
