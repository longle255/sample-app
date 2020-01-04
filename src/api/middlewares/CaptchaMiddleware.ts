import reCAPTCHA from 'recaptcha2';
import { Context } from 'koa';
import { env } from '../../env';
import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
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
      // console.log(errors);
      if (!ctx.request.body.captcha) {
        throw new InvalidCaptchaError('Please solve the captcha', errors);
      }
    }
  }
}
