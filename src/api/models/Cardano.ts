import _ from 'lodash';
import mongoose from 'mongoose';
import { prop, getModelForClass, modelOptions, arrayProp } from '@typegoose/typegoose';

import { defaultOptions } from './BaseModel';

export enum Certificates {
  STAKE_DELEGATION = 'StakeDelegation',
  STAKE_UNDELEGATION = 'StakeUnDelegation',
  OWNER_STAKE_DELEGATION = 'OwnerStakeDelegation',
  POOL_REGISTRATION = 'PoolRegistration',
  POOL_UPDATE = 'PoolUpdate',
  POOL_RETIREMENT = 'PoolRetirement',
}

export enum LeaderType {
  POOL = 'Pool',
  BFT_LEADER = 'BftLeader',
}

export enum UtxoTypes {
  INPUT = 'Input',
  OUTPUT = 'Output',
}

@modelOptions({
  existingMongoose: mongoose,
  schemaOptions: Object.assign({}, defaultOptions, {
    collection: 'cardano-pools',
  }),
})
// tslint:disable-next-line: max-classes-per-file
export class IPool {
  public static fromGraphql(data: any): IPool {
    return {
      _id: data.id,
      startValidity: data.registration.startValidity,
      managementThreshold: data.registration.managementThreshold,
      owners: data.registration.owners,
      operators: data.registration.operators,
      feeMaxLimit: data.registration.rewards.maxLimit,
      feeRatioNumerator: data.registration.rewards.ratio.numerator,
      feeRatioDenominator: data.registration.rewards.ratio.denominator,
      feeFixed: data.registration.rewards.fixed,
      rewardAccount: data.registration.rewardAccount?.id,
      retirementTime: data.retirement?.retirementTime,
    } as IPool;
  }

  @prop({ index: true, unique: true })
  public _id: string;

  @prop()
  public startValidity: number;

  @prop()
  public managementThreshold: number;

  @arrayProp({ _id: false, items: String })
  public owners: string[];

  @arrayProp({ _id: false, items: String })
  public operators: string[];

  @prop()
  public feeMaxLimit: number;

  @prop()
  public feeRatioNumerator: number;

  @prop()
  public feeRatioDenominator: number;

  @prop()
  public feeFixed: number;

  @prop()
  public rewardAccount: string;

  @prop()
  public retirementTime: number;

  @arrayProp({ _id: false, items: String, default: [] })
  public delegators: string[];
}

// tslint:disable-next-line: max-classes-per-file
export class Utxo {
  public static fromGraphql(data: any, type: UtxoTypes): Utxo {
    return {
      amount: data.amount,
      address: data.address.id,
      type,
    } as Utxo;
  }
  @prop()
  public amount: number;
  @prop()
  public address: string;
  @prop({ enum: UtxoTypes })
  public type: string;
}

// tslint:disable-next-line: max-classes-per-file
export class Certificate {
  public static fromGraphql(data: any): Certificate {
    const ret: Certificate = {
      account: undefined,
      pool: undefined,
      pools: [],
      type: undefined,
    };
    ret.type = data.__typename;
    switch (data.__typename) {
      case Certificates.STAKE_DELEGATION: {
        ret.account = data.account.id;
        if (!data.pools || !data.pools.length) {
          ret.type = Certificates.STAKE_UNDELEGATION;
        } else {
          // ASSUMPTION: pools[] has only one id
          ret.pool = data.pools[0].id;
          ret.pools = [ret.pool];
        }
        break;
      }
      case Certificates.OWNER_STAKE_DELEGATION: {
        // ASSUMPTION: pools[] has only one id
        ret.pool = data.pools[0].id;
        ret.pools = [ret.pool];
        break;
      }
      case Certificates.POOL_REGISTRATION: {
        // ASSUMPTION: pools[] has only one id
        ret.pool = data.pool.id;
        ret.pools = [ret.pool];
        break;
      }
      case Certificates.POOL_UPDATE:
      case Certificates.POOL_RETIREMENT: {
        ret.pool = data.poolId;
        ret.pools = [ret.pool];
        break;
      }
      default: {
        throw new Error('Should not come here. data: ' + JSON.stringify(data));
      }
    }
    return ret;
  }
  @prop()
  public account: string;

  @arrayProp({ _id: false, ref: IPool, refType: mongoose.Schema.Types.String })
  public pools: IPool[];

  @prop({ ref: IPool, refType: mongoose.Schema.Types.String })
  public pool: IPool;

  @prop({ enum: Certificates, default: Certificates.STAKE_DELEGATION })
  public type: string;
}

@modelOptions({
  existingMongoose: mongoose,
  schemaOptions: Object.assign({}, defaultOptions, {
    collection: 'cardano-transactions',
  }),
})
// tslint:disable-next-line: max-classes-per-file
export class ITransaction {
  public static fromGraphql(data: any): ITransaction {
    return {
      _id: data.id,
      blockId: data.block.id,
      certificate: data.certificate ? Certificate.fromGraphql(data.certificate) : undefined,
      inputs: data.inputs.map(e => Utxo.fromGraphql(e, UtxoTypes.INPUT)),
      outputs: data.outputs.map(e => Utxo.fromGraphql(e, UtxoTypes.OUTPUT)),
      chainLength: parseInt(data.block.chainLength, 10),
    } as ITransaction;
  }

  @prop({ index: true, unique: true })
  public _id: string;

  @prop({ index: true, required: true })
  public blockId: string;

  @prop({ index: true })
  public chainLength: number;

  @arrayProp({ required: true, _id: false, items: Utxo })
  public inputs: Utxo[];

  @arrayProp({ required: true, _id: false, items: Utxo })
  public outputs: Utxo[];

  @prop()
  public certificate: Certificate;

  public getType(): string {
    return this.certificate ? this.certificate.type : undefined;
  }
}

@modelOptions({
  existingMongoose: mongoose,
  schemaOptions: Object.assign({}, defaultOptions, {
    collection: 'cardano-addresses',
  }),
})
// tslint:disable-next-line: max-classes-per-file
export class IAddress {
  public static fromGraphql(data: any): IAddress {
    return {} as IAddress;
  }

  @prop({ index: true, unique: true })
  public _id: string;

  @arrayProp({ _id: false, items: String })
  public addresses: string[];

  @prop({ index: true, ref: IPool, refType: mongoose.Schema.Types.String })
  public delegation: IPool;

  @arrayProp({ required: true, _id: false, ref: ITransaction, refType: mongoose.Schema.Types.String })
  public transactions: ITransaction[];

  @arrayProp({ required: true, _id: false, ref: IPool, refType: mongoose.Schema.Types.String })
  public pools: IPool[];
}

@modelOptions({
  existingMongoose: mongoose,
  schemaOptions: Object.assign({}, defaultOptions, {
    collection: 'cardano-blocks',
  }),
})
// tslint:disable-next-line: max-classes-per-file
export class IBlock {
  public static fromGraphql(data: any): IBlock {
    return {
      _id: data.id,
      epoch: parseInt(data.date.epoch.id, 10),
      slot: parseInt(data.date.slot, 10),
      chainLength: parseInt(data.chainLength, 10),
      leaderType: data.leader.__typename,
      leader: data.leader.__typename === LeaderType.POOL ? data.leader.poolId : data.leader.bftLeaderId,
      transactions: data.transactions.edges.map(e => ITransaction.fromGraphql(e.node)),
    } as IBlock;
  }

  @prop({ index: true, unique: true })
  public _id: string;

  @prop()
  public epoch: number;

  @prop()
  public slot: number;

  @prop({ index: true })
  public chainLength: number;

  @prop({ index: true })
  public leader: string;

  @prop({ enum: LeaderType, default: LeaderType.POOL })
  public leaderType: string;

  @arrayProp({ required: true, _id: false, ref: ITransaction, refType: mongoose.Schema.Types.String })
  public transactions: ITransaction[];
}

export const Transaction = getModelForClass(ITransaction);
export const Block = getModelForClass(IBlock);
export const Pool = getModelForClass(IPool);
export const Address = getModelForClass(IAddress);
