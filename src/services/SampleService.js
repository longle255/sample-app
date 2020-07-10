import qs from 'qs';
import { appConfig } from '../config';
import { BaseService } from './BaseService';

const { apiUrl } = appConfig;

class SampleService extends BaseService {
  constructor() {
    super({ baseApiUrl: apiUrl });
  }

  getSamples(model) {
    const params = {
      pageNumber: model.pagination.current,
      pageSize: model.pagination.pageSize,
      sort: model.sort.field,
      order: this.convertOrder(model.sort.order),
    };
    const url = `api/sample?${qs.stringify(params)}`;

    return this.get(url);
  }
}

export const sampleService = new SampleService();
