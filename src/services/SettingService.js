import { appConfig } from '../config';
import { BaseService } from './BaseService';

const { apiUrl } = appConfig;

class SettingService extends BaseService {
  constructor() {
    super({ baseApiUrl: apiUrl });
  }

  getServerSetting() {
    const url = `api/settings`;

    return this.get(url);
  }
}

export const settingService = new SettingService();
