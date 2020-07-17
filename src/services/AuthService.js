import { appConfig } from '../config';
import { BaseService } from './BaseService';
import { StorageService } from './StorageService';

export interface ITokenInfo {
  token_type: string;
  access_token: string;
  refreshToken: string;
  expires_in: string;
  profile: any;
}

const { apiUrl } = appConfig;

class AuthService extends BaseService {
  constructor() {
    super({ baseApiUrl: apiUrl });
  }

  init(): void {
    // this.loadUserProfile();
  }

  registerNewUser(data: any) {
    const url = 'api/v1/auth/register';

    return this.post(url, data);
  }

  verifyEmail(data: any) {
    const url = 'api/v1/auth/confirm-email';

    return this.post(url, data);
  }

  sendVerifyEmail(data: any) {
    const url = 'api/v1/auth/resend-confirm-email';

    return this.post(url, data);
  }

  isSignedIn(): boolean {
    return !!StorageService.getToken();
  }

  logIn(userInfo: any): Promise<ITokenInfo> {
    const url = 'api/v1/auth/login';

    return this.post(url, userInfo);
  }

  logOut(): void {
    StorageService.removeToken();
  }

  forgotPassword(data: any) {
    const url = 'api/v1/auth/forgot-password';

    return this.post(url, data);
  }

  resetPassword(data: any) {
    const url = 'api/v1/auth/reset-password';

    return this.post(url, data);
  }
}

export const authService = new AuthService();
