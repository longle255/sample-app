import React from 'react';
import { Helmet } from 'react-helmet';
import ACL from 'components/app/ACL';
import { APP_URLS } from 'constants/APP_URLS';
import TwoFA from './TwoFA';

const TwoFAPage = () => {
  return (
    <ACL roles={['user']} redirect={APP_URLS.notFound}>
      <Helmet title="Two-factors authentication settings" />
      <TwoFA />
    </ACL>
  );
};

export default TwoFAPage;
