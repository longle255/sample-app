import React from 'react';
import { Helmet } from 'react-helmet';
import ACL from 'components/app/ACL';
import Overlay from 'components/app/Overlay';
import Dashboard from './Dashboard';

const DashboardPage = () => {
  return (
    <ACL roles={['admin', 'user']} redirect>
      <Helmet title="Dashboard" />
      <Dashboard />
      <Overlay />
    </ACL>
  );
};

export default DashboardPage;
