import { appConfig } from '../config';
import { BaseService } from './BaseService';
import { StorageService } from './StorageService';

const { apiUrl } = appConfig;
const isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

class FileService extends BaseService {
  constructor() {
    super({
      baseApiUrl: apiUrl,
    });
  }

  getUploadLink(data) {
    const url = 'api/v1/files';

    return this.post(url, data);
  }

  uploadFile(url, formData: any) {
    const headers = new Headers();

    return this.request('PUT', url, formData, headers);
  }

  getHeadersForUploadFile() {
    const headers = {};
    const token = StorageService.getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Source: http://pixelscommander.com/en/javascript/javascript-file-download-ignore-content-type/
  downloadFile(sUrl) {
    // iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
      // alert('Your device does not support files downloading. Please try again in desktop browser.');
      window.open(sUrl, '_blank');
      return false;
    }

    // If in Chrome or Safari - download via virtual link click
    if (isChrome || isSafari) {
      // Creating new link node.
      const link = document.createElement('a');
      link.href = sUrl;
      link.setAttribute('target', '_blank');

      if (link.download !== undefined) {
        // Set HTML5 download attribute. This will prevent file from opening if supported.
        const fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
        link.download = fileName;
      }

      // Dispatching click event.
      if (document.createEvent) {
        const e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        link.dispatchEvent(e);
        return true;
      }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
      sUrl += '?download';
    }

    window.open(sUrl, '_blank');
    return true;
  }
}

export const fileService = new FileService();
