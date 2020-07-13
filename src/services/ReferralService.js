import qs from 'qs';

import { appConfig } from '../config';
import { BaseService } from './BaseService';
import { APP_URLS } from '../constants/APP_URLS';

const { apiUrl } = appConfig;

class ReferralService extends BaseService {
  constructor() {
    super({ baseApiUrl: apiUrl });
  }

  getReferrals(model) {
    const params = {
      pageNumber: model.pagination.current - 1,
      pageSize: model.pagination.pageSize,
      sort: model.sort.field,
      order: this.convertOrder(model.sort.order),
    };
    const url = `api/v1/users/profile/referrals?${qs.stringify(params)}`;

    return this.get(url);
  }

  getReferralLink(model) {
    const params = {
      ref: model.code,
    };
    let relativeUrl = `${APP_URLS.signUp}?${qs.stringify(params)}`;
    relativeUrl = relativeUrl.startsWith('/') ? relativeUrl.substring(1) : relativeUrl;

    const { location } = window;
    const currentAppUrl = `${location.protocol}//${location.hostname}${
      location.port ? `:${location.port}` : ''
    }`;
    const fullUrl = this.getFullUrl(relativeUrl, currentAppUrl);

    return fullUrl;
  }

  sendInvitations(data) {
    const url = 'api/v1/users/profile/send-invitation';

    return this.post(url, data);
  }

  getBonuses(model) {
    const params = {
      pageNumber: model.pagination.current - 1,
      pageSize: model.pagination.pageSize,
      sort: model.sort.field,
      order: this.convertOrder(model.sort.order),
    };
    const url = `api/v1/bonus?${qs.stringify(params)}`;

    return this.get(url);
  }

  withdrawBonus(data) {
    const url = 'api/v1/bonus/withdraw';

    return this.post(url, data);
  }

  getWithdrawals(model) {
    const params = {
      fundTypes: 'bonus',
      pageNumber: model.pagination.current - 1,
      pageSize: model.pagination.pageSize,
      sort: model.sort.field,
      order: this.convertOrder(model.sort.order),
    };
    const url = `api/v1/withdrawals?${qs.stringify(params)}`;

    return this.get(url);
  }
}

export const referralService = new ReferralService();
