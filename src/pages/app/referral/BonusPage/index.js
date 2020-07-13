import React from 'react';
import { Helmet } from 'react-helmet';
import ACL from 'components/app/ACL';
import { APP_URLS } from 'constants/APP_URLS';
import Bonus from './Bonus';

const BonusPage = () => {
  return (
    <ACL roles={['user']} redirect={APP_URLS.notFound}>
      <Helmet title="Sign In" />
      <Bonus />
    </ACL>
  );
};

export default BonusPage;
