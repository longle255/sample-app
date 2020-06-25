import { Logger } from '../lib/logger';
import Container from 'typedi';
import { CardanoService } from '../api/services/CardanoService';
// import { Block, Transaction } from '../api/models';
export const TransactionMonitorJob = async (job, done) => {
  const log = new Logger(__filename);
  const cardanoService = Container.get<CardanoService>(CardanoService);
  try {
    const start = new Date();
    log.debug('[TransactionMonitor] start job %s', new Date());
    // const pool = await cardanoService.getPoolInfo('610af44fcac7b48c150419b5ff75febd2d7048a255b0e13bcf03fde75faca36d');
    // console.log(JSON.stringify(pool, undefined, 2));
    await cardanoService.fetchMostRecentBlocks();

    // await cardanoService.processBlock(3962);
    // block = await cardanoService.processBlock(649244);
    log.debug('[TransactionMonitor] done job after %d miliseconds', Date.now() - start.getTime());
    done();
  } catch (e) {
    console.log('ERROR:', e);
    return done(e);
  }
};

export const TransactionMonitorJobName = 'TransactionMonitor';
export const TransactionMonitorJobDefinition = [TransactionMonitorJobName, {}, TransactionMonitorJob];
