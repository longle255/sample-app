import _Agenda from 'agenda';
import { Service } from 'typedi';

@Service()
export default class Agenda extends _Agenda {
  public config: any;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	private _isReady: boolean;

	public configure(config: any): void {
		this.config = {
			logger: console,
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

				try {
					// clean up finished job
					// tslint:disable-next-line:no-null-keyword
					const cleanedUp = await this.cancel({ nextRunAt: null });
					this.config.logger.debug(`cleaned up ${cleanedUp} finished jobs`);

					// we cancel jobs here so we don't create duplicates
					// on every time the server restarts, or mongoose reconnects
					// (even though `agenda.every` uses single, just to be safe)
					//
					// note that the core reason we have this is because
					// during development we may remove recurring jobs
					// and define new ones, therefore we don't want the old ones to run
					const numRemoved = await this.cancel({
						repeatInterval: {
							$exists: true,
							// tslint:disable-next-line:no-null-keyword
							$ne: null,
						},
					});
					// if there was an error then log it and stop agenda

					this.config.logger.debug(`cancelled ${numRemoved} jobs`);

					// Define all of our jobs
					this.config.agendaJobDefinitions.forEach((_job) => {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						this.define(..._job);
					});

					// Schedule recurring jobs
					this.config.agendaRecurringJobs.forEach((every) => {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						this.every(...every);
					});

					// Start jobs needed to run now
					this.config.agendaBootJobs.forEach((job) => {
						this.now(job);
					});

					await _Agenda.prototype.start.call(this);
					// output debug info
					resolve();
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
