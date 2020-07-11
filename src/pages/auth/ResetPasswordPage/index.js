import React from 'react';
import { Helmet } from 'react-helmet';
import ResetPassword from './ResetPassword';

const ResetPasswordPage = () => {
  return (
    <div>
      <Helmet title="Forgot Password" />
      <ResetPassword />
    </div>
  );
};

export default ResetPasswordPage;
