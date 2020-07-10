import { SendEmailJobDefinition, SendEmailJobName } from './SendEmailJob';
import { TestJobDefinition, TestJobName } from './TestJob';

export const JobDefinitions = [TestJobDefinition, SendEmailJobDefinition];
export const JobNames = [SendEmailJobName, TestJobName];
export const RecurringJobs = [
	// ['10 seconds', 'Test'],
	['30 seconds', 'BlockMonitor'],
];
export { TestJob } from './TestJob';

// Be note that Agenda scan DB every 5 seconds for new job. So the minimum interval should be greater than 5
// otherwise can configure agenda by processEvery('1 seconds')
