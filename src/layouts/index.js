import React, { Fragment } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
import { Helmet } from 'react-helmet';
import { siteConfig } from 'config.js';
import PublicLayout from './Public';
import AuthLayout from './Auth';
import MainLayout from './Main';

const Layouts = {
  public: PublicLayout,
  auth: AuthLayout,
  main: MainLayout,
};

const mapStateToProps = ({ auth, user: { profile } }) => ({ auth, profile });
let previousPath = '';

const Layout = ({ auth, profile, children, location: { pathname, search } }) => {
  // NProgress & ScrollTop Management
  const currentPath = pathname + search;
  if (currentPath !== previousPath) {
    window.scrollTo(0, 0);
    NProgress.start();
  }
  setTimeout(() => {
    NProgress.done();
    previousPath = currentPath;
  }, 300);

  // Layout Rendering
  const getLayout = () => {
    if (pathname === '/') {
      return 'public';
    }
    if (/^\/auth(?=\/|$)/i.test(pathname)) {
      return 'auth';
    }
    return 'main';
  };

  const Container = Layouts[getLayout()];
  const isUserAuthorized = profile !== null;
  const isUserLoading = auth.isLoading;
  const isAuthLayout = getLayout() === 'auth';

  const BootstrappedLayout = () => {
    // show loader when user in check authorization process, not authorized yet and not on login pages
    if (isUserLoading && !isUserAuthorized && !isAuthLayout) {
      return null;
    }
    // redirect to login page if current is not login page and user not authorized
    if (!isAuthLayout && !isUserAuthorized) {
      // debugger;
      return <Redirect to="/auth/signin" />;
    }
    // in other case render previously set layout
    return <Container>{children}</Container>;
  };

  return (
    <Fragment>
      <Helmet titleTemplate={`${siteConfig.siteName} | %s`} title={siteConfig.siteName} />
      {BootstrappedLayout()}
    </Fragment>
  );
};

export default withRouter(connect(mapStateToProps)(Layout));
