import { TransactionMonitorJobDefinition, TransactionMonitorJobName } from './TransactionMonitorJob';
import { TestJobDefinition, TestJobName } from './TestJob';
import { SendEmailJobDefinition, SendEmailJobName } from './SendEmailJob';
export const JobDefinitions = [TestJobDefinition, SendEmailJobDefinition, TransactionMonitorJobDefinition];
export const JobNames = [SendEmailJobName, TestJobName, TransactionMonitorJobName];
export const RecurringJobs = [
  ['1 hours', 'Test'],
  ['1 minutes', 'TransactionMonitor'],
];
export { TestJob } from './TestJob';

// Be note that Agenda scan DB every 5 seconds for new job. So the minimum interval should be greater than 5
// otherwise can configure agenda by processEvery('1 seconds')
