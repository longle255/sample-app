import Agenda from '../lib/agenda';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Logger } from '../lib/logger';
import { env } from '../env';
import { JobDefinitions, RecurringJobs } from '../jobs';
import { Container } from 'typedi';

export const agenda: Agenda = new Agenda(env.agenda);

export const agendaLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    const log = new Logger(__filename);
    agenda.configure({
        logger: log,
        agendaJobDefinitions: JobDefinitions,
        agendaRecurringJobs: RecurringJobs,
    });
    agenda.start();
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
