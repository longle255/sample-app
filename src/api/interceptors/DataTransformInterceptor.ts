import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';

@Interceptor()
export class DataTransformInterceptor implements InterceptorInterface {
    public intercept(action: Action, result: any): any | Promise<any> {
        if (result.toJSON) {
            result = result.toJSON();
        }
        return result;
    }
}
