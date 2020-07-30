import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Container } from 'typedi';

import { env } from '../env';
import { JobDefinitions, RecurringJobs } from '../jobs';
import Agenda from '../lib/agenda';
import { Logger } from '../lib/logger';

export const agenda: Agenda = Container.get(Agenda);

export const agendaLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  const log = new Logger(__filename);
  log.debug('Loading agenda started');
  log.getWinston().profile('loading agenda');
  agenda.configure({
    logger: log,
    agendaJobDefinitions: JobDefinitions,
    agendaRecurringJobs: env.isWorker ? RecurringJobs : [['10 seconds', 'Test']],
  });
  agenda.mongo(settings.getData('mongoose').connection.db, env.agenda.collectionName);
  await agenda.start();

  async function graceful(): Promise<void> {
    await agenda.stop();
    log.info('agenda stopped gracefully');
    process.exit(0);
  }

  // handle graceful restarts
  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);
  if (settings) {
    settings.setData('agenda', agenda);
    settings.onShutdown(graceful);
  }
  Container.set('agenda', agenda);
  log.getWinston().profile('loading agenda');
};
