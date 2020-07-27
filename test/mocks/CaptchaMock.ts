export class CaptchaMock {
  public validateRequestMock = jest.fn();
  public translateErrorsMock = jest.fn();

  public getRequestOptions(): any {
    return null;
  }
  public validate(): Promise<void> {
    return Promise.resolve();
  }

  public formElement(): string {
    return null;
  }

  public validateRequest(request, site): Promise<void> {
    this.validateRequestMock(request, site);
    if (request.body.captcha === 'correct') return Promise.resolve();
    throw new Error('Invalid captcha');
  }

  public translateErrors(...args: any[]): any {
    this.translateErrorsMock(args);
    return Promise.resolve([]);
  }

}
