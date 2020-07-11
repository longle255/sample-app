import * as HttpStatus from 'http-status-codes';
import { cacheService } from 'services';

import trimEnd from 'lodash-es/trimEnd';
import trimStart from 'lodash-es/trimStart';
import upperFirst from 'lodash-es/upperFirst';
import { StorageService } from './StorageService';

const CONTENT_TYPE_TEXT = 'Content-Type';

export class BaseService {
  constructor(options) {
    this.baseApiUrl = options.baseApiUrl;
  }

  get(url) {
    return this.request('GET', url);
  }

  delete(url) {
    return this.request('DELETE', url);
  }

  put(url, data) {
    return this.request('PUT', url, data);
  }

  post(url, data) {
    return this.request('POST', url, data);
  }

  request(method, url, data, headers = null) {
    let body = data;
    headers = headers || new Headers();
    const token = StorageService.getToken();
    const installId = StorageService.getInstallId();

    headers.set('Accept', 'application/json');
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Access-Control-Allow-Origin', '*');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (installId) {
      headers.set('X-Install-Id', installId);
    }

    if (data) {
      if (typeof data === 'object') {
        headers.set(CONTENT_TYPE_TEXT, 'application/json');
        body = JSON.stringify(data);
      } else {
        headers.set(CONTENT_TYPE_TEXT, 'application/x-www-form-urlencoded');
      }
    }

    let fullUrl = this.getFullUrl(url);
    const randomNumber = cacheService.getRandomNumber();
    if (randomNumber) {
      fullUrl += fullUrl.indexOf('?') >= 0 ? `&rnd=${randomNumber}` : `?rnd=${randomNumber}`;
    }

    const request = new Request(fullUrl, {
      method,
      headers,
      body,
      cache: 'reload',
      mode: 'cors',
    });

    return fetch(request)
      .then(async response => {
        if (response.statusCode === HttpStatus.UNAUTHORIZED) {
          const isBelongAuthUrl =
            response.url.includes('auth/login') ||
            response.url.includes('auth/beta-login') ||
            response.url.includes('auth/prelogin') ||
            response.url.includes('auth/beta-prelogin');

          if (!isBelongAuthUrl) {
            // Unauthorized; redirect to sign-in
            StorageService.removeToken();
            StorageService.removeData(StorageService.USER_INFO_KEY);
            window.location.replace('/login?expired=1');
            return null;
          }
        }

        const responseData = await this.getResponseData(response);
        if (response.ok) {
          return responseData;
        }

        response.data = responseData;
        // throw response;
        return Promise.reject(response);
      })
      .catch(async response => {
        if (!response.data) {
          const tmp = await this.getResponseData(response);
          response.data = tmp;
        }

        return Promise.reject(await this.handleError(response));
      });
  }

  getFullUrl(url, baseUrl = null) {
    baseUrl = trimEnd(baseUrl || this.baseApiUrl, '/');
    url = trimStart(url, '/');

    return `${baseUrl}/${url}`;
  }

  convertOrder(order) {
    return order === 'descend' ? -1 : 1;
  }

  async handleError(response) {
    const { status, statusText, data } = response;
    const errors = {};
    const errorMessages = [];
    const codeName = data ? data.codeName : null;
    let hasMessages = false;

    if (data instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', data.message);
    } else if (status === HttpStatus.BAD_REQUEST || status === HttpStatus.CONFLICT) {
      if (data.errors) {
        data.errors.forEach(item => {
          if (item.field && item.messages) {
            const { field, messages } = item;
            hasMessages = !!messages.length;

            messages.forEach((x: string) => {
              const message = x.replace(`"${field}"`, upperFirst(field));
              // errorMessages.push(message);
              if (!errors[field]) {
                errors[field] = [];
              }
              errors[field].push(message);
            });
          } else if (item.constraints && item.property) {
            errors[item.property] = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const key of Object.keys(item.constraints)) {
              errors[item.property].push(`[${key}]: ${item.constraints[key]}`);
            }
          }
        });
      }

      if (!hasMessages && data.message) {
        errorMessages.push(data.message);
      }
    } else if (status === HttpStatus.UNAUTHORIZED) {
      console.log('get refresh token');
      // this.refreshToken();
      errorMessages.push(data.message);
    } else if (status === HttpStatus.FORBIDDEN) {
      errorMessages.push(data.message);
    } else if (data.message) {
      errorMessages.push(data.message);
    }

    if (!errorMessages.length && !hasMessages) {
      errorMessages.push('Something went wrong. Please try again.');
    }

    // TODO: Send error to API for debugging
    const errorMessage = errorMessages.join('\n');
    const errorInfo = {
      codeName,
      response,
      errors,
      errorMessages,
      message: errorMessage,
    };

    return errorInfo;
  }

  async getResponseData(response) {
    if (!response.headers) {
      return {};
    }

    const responseContentType = response.headers.get('content-type');
    let result;

    if (responseContentType && responseContentType.indexOf('application/json') !== -1) {
      result = await response.json();
    } else if (
      responseContentType &&
      responseContentType.indexOf('application/octet-stream') !== -1
    ) {
      result = await response.blob();
    } else {
      result = await response.text();
    }

    if (response.ok) {
      return result;
    }

    return result;
  }
}
