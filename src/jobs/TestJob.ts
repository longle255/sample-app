import { Logger } from '../lib/logger';
import { sleep } from '../utils';

export const TestJob = async (job, done) => {
	const log = new Logger(__filename);
	try {
    log.debug('test job %o', job.attr);
    log.getWinston().profile('test');
    await sleep(100);
    log.getWinston().profile('test');
		done();
	} catch (e) {
		return done(e);
	}
};

export const TestJobName = 'Test';
export const TestJobDefinition = [TestJobName, {}, TestJob];
