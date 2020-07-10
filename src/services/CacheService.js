import lscache from 'lscache';
import { siteConfig } from '../config';
import { StorageService } from './StorageService';

const { appVersion } = siteConfig;
const CACHE_VERSION = 'CACHE_VERSION';
const RANDOM_NUMBER = 'RANDOM_NUMBER';

export class CacheService {
  static currentUserProfile: null;

  cacheVersion: string;

  currentVersion: string;

  constructor() {
    this.cacheVersion = StorageService.getData(CACHE_VERSION);
    this.currentVersion = appVersion;
  }

  init() {
    if (this.cacheVersion !== this.currentVersion) {
      // Clear cache
      lscache.flush();
      StorageService.setData(CACHE_VERSION, this.currentVersion);
      this.generateRandomNumber();
    }
  }

  generateKey(key) {
    return [this.currentVersion, key.trim()].join(':').toUpperCase();
  }

  set(key, data, time) {
    lscache.set(this.generateKey(key), data, time);
  }

  get(key) {
    return lscache.get(this.generateKey(key));
  }

  generateRandomNumber() {
    const randomNumber = +new Date();
    this.set(RANDOM_NUMBER, randomNumber, 100000);
  }

  getRandomNumber() {
    return this.get(RANDOM_NUMBER);
  }
}

export const cacheService = new CacheService();
cacheService.init();
