import _ from 'lodash';
import { Service } from 'typedi';
import { LoggerInterface } from '../../decorators/Logger';
import { Logger } from '../../lib/logger';
import { Block, IBlock, ITransaction, Transaction, Certificates, Address, IPool, Pool } from '../models';
import { GraphQLClient } from 'graphql-request';
import { env } from '../../env';
import { DocumentType } from '@typegoose/typegoose';

const UtxoInputFragment = `fragment inputs on TransactionInput {
  amount
  address { id }
}`;
const UtxoOutputFragment = `fragment outputs on TransactionOutput {
  amount
  address { id }
}`;
const CertificateFragment = `fragment certificate on Certificate {
  __typename
  ... on StakeDelegation{
    account {id}
    pools {id}
  }
  ... on OwnerStakeDelegation{
    pools {id}
  }
  ... on PoolRegistration {
    pool {id}
  }
  ... on PoolUpdate {
    poolId
  }
  ... on PoolRetirement {
    poolId
  }
}`;
const TransactionFragment = `fragment trans on Transaction {
  id,
  block {
    id
    date { epoch { id } slot }
    chainLength
  }
  inputs {
    ... inputs
  }
  outputs {
    ... outputs
  }
  certificate {
    ... certificate
  }
}`;

const BlockFragment = `fragment block on Block {
  id,
  date {epoch{id} slot},
  chainLength
  leader {
    __typename
    ... on Pool { poolId: id }
    ... on BftLeader { bftLeaderId: id }
  }
  transactions {
    totalCount
    edges {
      node {
        ...trans
      }
    }
  }
}`;

@Service()
export class CardanoService {
  private client: GraphQLClient;
  private log: LoggerInterface;

  constructor() {
    this.log = new Logger(__filename);
    this.client = new GraphQLClient(env.cardanoConfig.graphqlUrl);
  }

  public async getTransactionById(txid: string): Promise<ITransaction> {
    return new Promise(async (resolve, reject) => {
      this.log.debug('[getTransactionById] querying for transaction', txid);
      try {
        const query = `{
          transaction (id:"${txid}") {
            ... trans
          }
        } ${[UtxoInputFragment, UtxoOutputFragment, TransactionFragment, CertificateFragment]}`;
        const data = await this.client.request(query);
        console.log(JSON.stringify(data, undefined, 2));
        return resolve(undefined);
      } catch (e) {
        return reject(e);
      }
    });
  }

  public async getBlockByChainLength(chainLength: number): Promise<IBlock> {
    return new Promise(async (resolve, reject) => {
      this.log.debug('[getBlockByChainLength] querying for block', chainLength);
      try {
        const query = `{
          blockByChainLength(length:"${chainLength}") {
            ... block
          }
        } ${[UtxoInputFragment, UtxoOutputFragment, TransactionFragment, CertificateFragment, BlockFragment]}`;
        const data = await this.client.request(query);
        const block: IBlock = IBlock.fromGraphql(data.blockByChainLength);
        return resolve(block);
      } catch (e) {
        return reject(e);
      }
    });
  }

  public async getBlockById(id: string): Promise<IBlock> {
    return new Promise(async (resolve, reject) => {
      this.log.debug('[getBlockById] querying for block', id);
      try {
        const query = `{
          block(id:"${id}") {
            ...block
          }
        } ${[UtxoInputFragment, UtxoOutputFragment, TransactionFragment, CertificateFragment, BlockFragment]}`;
        const data = await this.client.request(query);
        const block: IBlock = IBlock.fromGraphql(data.blockByChainLength);
        return resolve(block);
      } catch (e) {
        return reject(e);
      }
    });
  }

  public async getLatestBlock(): Promise<IBlock> {
    return new Promise<IBlock>(async (resolve, reject) => {
      this.log.debug('[getBlockByChainLength] querying for last block');
      try {
        const query = `{
          status {
            latestBlock { ...block }
          }
        } ${[UtxoInputFragment, UtxoOutputFragment, TransactionFragment, CertificateFragment, BlockFragment]}`;
        const data = await this.client.request(query);
        const block: IBlock = IBlock.fromGraphql(data.status.latestBlock);
        return resolve(block);
      } catch (e) {
        return reject(e);
      }
    });
  }

  public async getPoolInfo(id: string): Promise<IPool> {
    return new Promise<IPool>(async (resolve, reject) => {
      this.log.debug('[getPoolInfo] querying for pool', id);
      try {
        const query = `{
          stakePool(id:"${id}") {
            id
            registration {
              startValidity
              managementThreshold
              owners
              operators
              rewards { maxLimit ratio { numerator denominator } fixed }
              rewardAccount { id }
            }
            retirement { retirementTime }
          }
        }`;
        const data = await this.client.request(query);
        const pool: IPool = IPool.fromGraphql(data.stakePool);
        return resolve(pool);
      } catch (e) {
        // there is a case pool with this id does not exist. Don't know why
        if (e.response.errors[0]?.message === 'Stake pool not found') {
          return resolve({ _id: id } as IPool);
        }
        return reject(e);
      }
    });
  }

  public async processTransaction(transactionData: ITransaction): Promise<DocumentType<ITransaction>> {
    this.log.debug('[processBlock] Processing transaction id', transactionData._id);
    return new Promise(async (resolve, reject) => {
      const tx = await Transaction.findOneAndUpdate({ _id: transactionData._id }, transactionData, { upsert: true, new: true });
      if (tx.getType() === Certificates.STAKE_DELEGATION || tx.getType() === Certificates.STAKE_UNDELEGATION) {
        const accountId = tx.certificate.account;
        let poolId = tx.certificate.pool;
        if (tx.getType() === Certificates.STAKE_UNDELEGATION) {
          const tmp = await Address.findOne({ _id: accountId });
          poolId = tmp.delegation;
        }
        const updateBody = {
          _id: accountId,
          $addToSet: {
            addresses: { $each: [tx.inputs[0]?.address, tx.outputs[0]?.address] },
            transactions: tx._id,
            ...(tx.getType() === Certificates.STAKE_DELEGATION && { pools: poolId }),
          },
          delegation: tx.getType() === Certificates.STAKE_DELEGATION ? poolId : undefined,
        };
        await Address.findOneAndUpdate({ _id: accountId }, updateBody, { upsert: true, new: true });
        let pool: DocumentType<IPool>;
        if (tx.getType() === Certificates.STAKE_DELEGATION) {
          pool = await Pool.findOne({ _id: poolId });
          if (!pool) {
            const poolData = await this.getPoolInfo(String(poolId));
            try {
              pool = await Pool.create(poolData);
            } catch (e) {
              // there is a case where pool was created by another transaction at the same block
              // do nothing
            }
          }
          pool = await Pool.findOneAndUpdate({ _id: poolId }, { $addToSet: { delegators: accountId } }, { new: true });
        } else {
          pool = await Pool.findOneAndUpdate({ _id: poolId }, { $pull: { delegators: accountId } }, { new: true });
        }
        // this.log.debug('[processBlock] pool and accounts: ', pool, acc, tx.getType());
      }
      return resolve(tx);
    });
  }

  public async processBlock(chainLength: number): Promise<DocumentType<IBlock>> {
    this.log.debug('[processBlock] Processing block', chainLength);
    return new Promise(async (resolve, reject) => {
      const blockData = await this.getBlockByChainLength(chainLength);
      if (!blockData) {
        return reject(new Error(`Block with height ${chainLength}is not available`));
      }
      let block;
      try {
        block = await Block.findOneAndUpdate({ _id: blockData._id }, blockData, { upsert: true, new: true });
      } catch (e) {
        // there is a case where block was created by another loop
        block = await Block.findOne({ _id: blockData._id });
      }
      await Promise.all(blockData.transactions.map(tx => this.processTransaction(tx)));
      return resolve(block);
    });
  }

  public async fetchMostRecentBlocks(): Promise<void> {
    const latestInDB = await Block.findOne().sort({ chainLength: -1 });
    const latestBlock = await this.getLatestBlock();
    const latestHeightDB = latestInDB ? latestInDB.chainLength : 1;
    const latestHeight = latestBlock.chainLength;
    let index = latestHeightDB;
    this.log.debug('[fetchMostRecentBlocks] Start syncing from', index, 'to', latestHeight);
    while (index <= latestHeight) {
      await this.processBlock(index);
      this.log.debug('[fetchMostRecentBlocks] Done processing block ', index++);
    }
  }
}
