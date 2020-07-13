import React from 'react';
import Referrals from './Referrals';
import SendInvitation from './SendInvitation';
import ReferralCode from './ReferralCode';

const Referral = () => {
  return (
    <div className="settings-container">
      <div className="row">
        <div className="col-md-7">
          <Referrals />
        </div>
        <div className="col-md-3">
          <ReferralCode />
          <SendInvitation />
        </div>
        <div className="col-md-2" />
      </div>
    </div>
  );
};

export default Referral;
