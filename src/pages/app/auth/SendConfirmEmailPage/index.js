import React from 'react';
import { Helmet } from 'react-helmet';
import SendConfirmEmail from './SendConfirmEmail';

const SendConfirmEmailPage = () => {
  return (
    <div>
      <Helmet title="Resend Confirmation Email" />
      <SendConfirmEmail />
    </div>
  );
};

export default SendConfirmEmailPage;
