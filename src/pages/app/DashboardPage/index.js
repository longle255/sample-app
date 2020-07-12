import React from 'react';
import { Helmet } from 'react-helmet';
import ACL from 'components/app/ACL';
import Dashboard from './Dashboard';

const DashboardPage = () => {
  return (
    <ACL roles={['admin', 'user']} redirect>
      <Helmet title="Sign In" />
      <Dashboard />
    </ACL>
  );
};

export default DashboardPage;
