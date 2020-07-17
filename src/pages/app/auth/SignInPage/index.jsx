import React from 'react';
import { Helmet } from 'react-helmet';
import SignIn from './SignIn';

const SignInPage = () => {
  return (
    <div>
      <Helmet title="Sign In" />
      <SignIn />
    </div>
  );
};

export default SignInPage;
