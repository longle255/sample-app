import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';
import { Pagination } from '../services/Pagination';
import { objectIdToString } from '../../utils/Utils';

@Interceptor()
export class DataTransformInterceptor implements InterceptorInterface {
  public intercept(action: Action, response: any): any | Promise<any> {
    if (!response) {
      return response;
    }

    if (response instanceof Pagination && response.results?.length) {
      // transform pagination response
      response.results = response.results.map(e => objectIdToString(e));
    } else if (response.toJSON) {
      // transform single document response
      response = objectIdToString(response.toJSON());
    }
    return response;
  }
}
