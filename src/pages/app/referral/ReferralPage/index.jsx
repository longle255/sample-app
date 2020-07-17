import React from 'react';
import { Helmet } from 'react-helmet';
import ACL from 'components/app/ACL';
import { APP_URLS } from 'constants/APP_URLS';
import Referral from './Referral';

const ReferralPage = () => {
  return (
    <ACL roles={['user']} redirect={APP_URLS.notFound}>
      <Helmet title="Referral" />
      <Referral />
    </ACL>
  );
};

export default ReferralPage;
