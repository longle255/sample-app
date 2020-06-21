import _ from 'lodash';
import { Service } from 'typedi';
import { Logger } from '../../lib/logger';
import { IInvitation, Invitation } from '../models';
import { BaseService } from './BaseService';

@Service()
export class InvitationService extends BaseService<IInvitation> {
  constructor() {
    super(new Logger(__filename), Invitation);
  }
}
