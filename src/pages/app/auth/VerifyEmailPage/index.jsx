import React from 'react';
import { Helmet } from 'react-helmet';
import VerifyEmail from './VerifyEmail';

const VerifyEmailPage = () => {
  return (
    <div>
      <Helmet title="Verify Email" />
      <VerifyEmail />
    </div>
  );
};

export default VerifyEmailPage;
