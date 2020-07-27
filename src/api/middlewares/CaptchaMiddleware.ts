import { Context } from 'koa';
import reCAPTCHA from 'recaptcha2';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

import { env } from '../../env';
import { InvalidCaptchaError } from '../errors/InvalidCaptchaError';



@Middleware({ type: 'before' })
export class CaptchaMiddleware implements KoaMiddlewareInterface {
  public isProduction = env.isProduction;
  public recaptchaObj = new reCAPTCHA({
    siteKey: env.recaptcha.siteKey,
    secretKey: env.recaptcha.secretKey,
  });

  public async use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    if (!this.isProduction || !env.recaptcha.enabled) {
      return next();
    }

    if (!ctx.request.body.captcha) {
      throw new InvalidCaptchaError('Please solve the captcha');
    }
    ctx.request.body['g-recaptcha-response'] = ctx.request.body['g-recaptcha-response'] || ctx.request.body.captcha;
    try {
      await this.recaptchaObj.validateRequest(ctx.request, ctx.request.headers.host);
      return next();
    } catch (err) {
      const errors = this.recaptchaObj.translateErrors(err);
      throw new InvalidCaptchaError('Please solve the captcha', errors);
    }
  }
}
