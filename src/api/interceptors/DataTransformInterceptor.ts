import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';

import { objectIdToString } from '../../utils/Utils';
import { Pagination } from '../services/Pagination';

@Interceptor()
export class DataTransformInterceptor implements InterceptorInterface {
  public intercept(_action: Action, response: any): any | Promise<any> {
    if (!response) {
      return response;
    }

    if (response instanceof Pagination && response.data?.length) {
      // transform pagination response
      response.data = response.data.map(e => objectIdToString(e));
    } else if (response.toJSON) {
      // transform single document response
      response = objectIdToString(response.toJSON());
    }
    return response;
  }
}
