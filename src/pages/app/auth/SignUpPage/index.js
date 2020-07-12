import React from 'react';
import { Helmet } from 'react-helmet';
import SignUp from './SignUp';

const SignUpPage = () => {
  return (
    <div>
      <Helmet title="Sign Up" />
      <SignUp />
    </div>
  );
};

export default SignUpPage;
