import countries from 'constants/countries.json';
import { appConfig } from '../config';
import { BaseService } from './BaseService';
import { CacheService } from './CacheService';

const { apiUrl } = appConfig;

class ProfileService extends BaseService {
  constructor() {
    super({ baseApiUrl: apiUrl });
  }

  getUserProfile() {
    const url = 'api/v1/users/profile';

    return this.get(url).then((result: any) => {
      CacheService.currentUserProfile = result;

      return result;
    });
  }

  getCountries() {
    return Promise.resolve(countries);
  }

  getUploadAvatarLink() {
    const url = 'api/v1/users/profile/avatar';

    return url;
  }

  updateUserProfile(data: any) {
    const url = 'api/v1/users/profile/update';

    return this.put(url, data);
  }

  changePassword(data: any) {
    const url = 'api/v1/users/profile/change-password';

    return this.put(url, data);
  }

  enable2FA(data: any) {
    const url = '/api/v1/users/profile/enable-2fa';

    return this.put(url, data);
  }

  confirm2FA(data: any) {
    const url = 'api/v1/users/profile/confirm-2fa';

    return this.put(url, data);
  }

  disable2FA(data: any) {
    const url = 'api/v1/users/profile/disable-2fa';

    return this.put(url, data);
  }
}

export const profileService = new ProfileService();
