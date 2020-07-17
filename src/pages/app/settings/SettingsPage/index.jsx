import React from 'react';
import { Helmet } from 'react-helmet';
import ACL from 'components/app/ACL';
import { APP_URLS } from 'constants/APP_URLS';
import Settings from './Settings';

const BonusPage = () => {
  return (
    <ACL roles={['user']} redirect={APP_URLS.notFound}>
      <Helmet title="Settings" />
      <Settings />
    </ACL>
  );
};

export default BonusPage;
