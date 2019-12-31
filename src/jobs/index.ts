import { TestJobDefinition, TestJobName } from './TestJob';
import { SendEmailJobDefinition, SendEmailJobName } from './SendEmailJob';
export const JobDefinitions = [TestJobDefinition, SendEmailJobDefinition];
export const JobNames = [SendEmailJobName, TestJobName];
export const RecurringJobs = [['1 hours', 'Test']];
export { TestJob } from './TestJob';
