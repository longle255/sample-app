export class JobServiceMock {

  public scheduleMock = jest.fn();
  public findMock = jest.fn();
  public schedule(when: string, jobName: string, args: any): Promise<any> {
    this.scheduleMock(when, jobName, args)
    return Promise.resolve();
  }

  public async find(cond?: object): Promise<any> {
    this.findMock(cond);
    return Promise.resolve();
  }
}
