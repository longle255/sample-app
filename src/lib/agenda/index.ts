import _Agenda from 'agenda';

export default class Agenda extends _Agenda {
  public config: any;
  // @ts-ignore
  private _isReady: boolean;

  public configure(config: any): void {
    this.config = {
      logger: console,
      // these are options passed directly to `stop-agenda`
      // <https://github.com/ladjs/stop-agenda>
      stopAgenda: {
        cancelQuery: {
          repeatInterval: {
            $exists: true,
            // tslint:disable-next-line:no-null-keyword
            $ne: null,
          },
        },
      },
      // these are jobs defined via `config.jobs`
      // e.g. `agendaJobDefinitions: [ [name, agendaOptions, fn], ... ]`
      agendaJobDefinitions: [],
      // these get automatically invoked to `agenda.every`
      // e.g. `agenda.every('5 minutes', 'locales')`
      // and you define them as [ interval, job name ]
      // you need to define them here for graceful handling
      // e.g. `agendaRecurringJobs: [ ['5 minutes', 'locales' ], ... ]`
      agendaRecurringJobs: [],
      // these get automatically invoked when process starts
      // e.g. `agenda.now('locales');`
      // and you define them as Strings in the array
      // e.g. `config.now: ['locales','ping','pong','beep', ... ]`
      agendaBootJobs: [],
      ...config,
    };
  }
  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.on('ready', async () => {
        // Pending PR #501
        // <https://github.com/agenda/agenda/pull/501>
        this._isReady = true;

        // output debug info
        this.config.logger.info('agenda ready');

        // we cancel jobs here so we don't create duplicates
        // on every time the server restarts, or mongoose reconnects
        // (even though `agenda.every` uses single, just to be safe)
        //
        // note that the core reason we have this is because
        // during development we may remove recurring jobs
        // and define new ones, therefore we don't want the old ones to run
        try {
          const numRemoved = await this.cancel(this.config.stopAgenda.cancelQuery);
          // if there was an error then log it and stop agenda

          this.config.logger.debug(`cancelled ${numRemoved} jobs`);

          // Define all of our jobs
          this.config.agendaJobDefinitions.forEach(_job => {
            // @ts-ignore
            this.define(..._job);
          });

          // Schedule recurring jobs
          this.config.agendaRecurringJobs.forEach(every => {
            // @ts-ignore
            this.every(...every);
          });

          // Start jobs needed to run now
          this.config.agendaBootJobs.forEach(job => {
            this.now(job);
          });

          await _Agenda.prototype.start.call(this);
        } catch (err) {
          this.config.logger.error(err);
          try {
            this.config.logger.debug('stopped agenda due to issue with agenda cancel');
            return this.stop();
          } catch (err) {
            this.config.logger.error(err);
            reject(err);
          }
          reject(err);
        }
      });
    });
  }
}
