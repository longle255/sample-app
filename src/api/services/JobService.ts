import { Job } from 'agenda';
import { Inject, Service } from 'typedi';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { JobNames } from '../../jobs';
import Agenda from '../../lib/agenda';

@Service()
export class JobService {
  @Inject(() => Agenda)
  private agenda: Agenda;

  constructor(@Logger(__filename) private log: LoggerInterface) {}

  public schedule(when: string, jobName: string, args: any): Promise<Job<any>> {
    this.log.verbose(`Schedule job [${jobName}] at [${when}]`);
    if (JobNames.indexOf(jobName) < 0) {
      throw new Error(`Can't find definition for job ${jobName}`);
    }
    if (when === 'now') {
      return this.agenda.now(jobName, args);
    }
    return this.agenda.schedule(when, jobName, args);
  }

  public async find(cond?: object): Promise<any> {
    return this.agenda.jobs(cond);
  }
}
