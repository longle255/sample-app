import { Context } from 'koa';
import reCAPTCHA from 'recaptcha2';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';

import { env } from '../../env';
import { InvalidCaptchaError } from '../errors/InvalidCaptchaError';

const recaptchaObj = new reCAPTCHA({
  siteKey: env.recaptcha.siteKey,
  secretKey: env.recaptcha.secretKey,
});

@Middleware({ type: 'before' })
export class CaptchaMiddleware implements KoaMiddlewareInterface {
  public async use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
    if (env.isDevelopment || !env.recaptcha.enabled) {
      return next();
    }

    if (!ctx.request.body.captcha) {
      throw new InvalidCaptchaError('Please solve the captcha');
    }
    ctx.request.body['g-recaptcha-response'] = ctx.request.body['g-recaptcha-response'] || ctx.request.body.captcha;
    try {
      await recaptchaObj.validateRequest(ctx.request, ctx.request.headers.host);
      return next();
    } catch (err) {
      const errors = recaptchaObj.translateErrors(err);
      if (!ctx.request.body.captcha) {
        throw new InvalidCaptchaError('Please solve the captcha', errors);
      }
    }
  }
}
