import { v4 } from 'uuid';

const INSTALL_ID_KEY = 'INSTALL_ID';

export class StorageService {
  static AUTH_TOKEN_KEY = 'app.AuthToken';

  static AUTH_REFRESH_TOKEN_KEY = 'app.AuthRefreshToken';

  static AUTH_EMAIL = 'app.AuthEmail';

  static USER_INFO_KEY = 'app.User';

  static getToken() {
    return window.localStorage.getItem(StorageService.AUTH_TOKEN_KEY);
  }

  static setToken(token) {
    if (token) {
      window.localStorage.setItem(StorageService.AUTH_TOKEN_KEY, token);
    }
  }

  static getRefreshToken() {
    return window.localStorage.getItem(StorageService.AUTH_REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token) {
    if (token) {
      window.localStorage.setItem(StorageService.AUTH_REFRESH_TOKEN_KEY, token);
    }
  }

  static getAuthEmail() {
    return window.localStorage.getItem(StorageService.AUTH_EMAIL);
  }

  static setAuthEmail(token) {
    if (token) {
      window.localStorage.setItem(StorageService.AUTH_EMAIL, token);
    }
  }

  static removeToken() {
    window.localStorage.removeItem(StorageService.AUTH_TOKEN_KEY);
  }

  static setData(key, data) {
    window.localStorage.setItem(key, JSON.stringify(data));
  }

  static removeData(key) {
    window.localStorage.removeItem(key);
  }

  static getData(key) {
    const text = window.localStorage.getItem(key) || '';

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      return null;
    }
  }

  static getInstallId() {
    let id = window.localStorage.getItem(INSTALL_ID_KEY);

    if (!id) {
      id = v4();
      window.localStorage.setItem(INSTALL_ID_KEY, id);
    }

    return id;
  }
}
