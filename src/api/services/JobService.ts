import _ from 'lodash';
import { Service } from 'typedi';
import { agenda } from '../../loaders/agendaLoader';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { JobNames } from '../../jobs';
import { Job } from 'agenda';

@Service()
export class JobService {
  constructor(@Logger(__filename) private log: LoggerInterface) {}

  public schedule(when: string, jobName: string, args: any): Promise<Job<any>> {
    this.log.debug(`Schedule job [${jobName}] at [${when}]`);
    if (JobNames.indexOf(jobName) < 0) {
      throw new Error(`Can't find definition for job ${jobName}`);
    }
    if (when === 'now') {
      return agenda.now(jobName, args);
    }
    return agenda.schedule(when, jobName, args);
  }

  public async find(cond?: object): Promise<any> {
    return agenda.jobs(cond);
  }
}
