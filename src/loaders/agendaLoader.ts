import Agenda from '../lib/agenda';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Logger } from '../lib/logger';
import { JobDefinitions, RecurringJobs } from '../jobs';
import { Container } from 'typedi';
import { env } from '../env';

export const agenda: Agenda = new Agenda();

export const agendaLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  const log = new Logger(__filename);
  agenda.configure({
    logger: log,
    agendaJobDefinitions: JobDefinitions,
    agendaRecurringJobs: RecurringJobs,
  });
  agenda.mongo(settings.getData('mongoose').connection.db, env.agenda.collectionName);
  await agenda.start();
  settings.setData('agenda', agenda);
  Container.set('agenda', agenda);
  async function graceful(): Promise<void> {
    await agenda.stop();
    log.info('agenda stopped gracefully');
    process.exit(0);
  }

  // handle graceful restarts
  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);
  settings.onShutdown(graceful);
};
