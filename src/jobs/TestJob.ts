import { Logger } from '../lib/logger';
export const TestJob = async (job, done) => {
  const log = new Logger(__filename);
  try {
    log.debug('test job %s', new Date());
    done();
  } catch (e) {
    return done(e);
  }
};

export const TestJobName = 'Test';
export const TestJobDefinition = [TestJobName, {}, TestJob];
