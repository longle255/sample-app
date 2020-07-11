import React, { lazy, Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import Layout from 'layouts';
import { APP_URLS } from './constants';

const routes = [
  {
    path: APP_URLS.signIn,
    Component: lazy(() => import('pages/auth/SignInPage')),
  },
  {
    path: `${APP_URLS.signUp}:ref?`,
    Component: lazy(() => import('pages/auth/SignUpPage')),
  },
  {
    path: APP_URLS.forgotPassword,
    Component: lazy(() => import('pages/auth/ForgotPasswordPage')),
  },
  {
    path: APP_URLS.resetPassword,
    Component: lazy(() => import('pages/auth/ResetPasswordPage')),
  },
  {
    path: APP_URLS.verifyEmail,
    Component: lazy(() => import('pages/auth/VerifyEmailPage')),
  },
  {
    path: APP_URLS.sendVerifyEmail,
    Component: lazy(() => import('pages/auth/SendConfirmEmailPage')),
  },
  // {
  //   path: APP_URLS.dashboard,
  //   component: lazy(() => import('pages/DashboardPage')),
  // },
  // {
  //   path: APP_URLS.referral,
  //   component: lazy(() => import('pages/ReferralPage')),
  // },
  // {
  //   path: APP_URLS.bonus,
  //   component: lazy(() => import('pages/BonusPage')),
  // },
  // {
  //   path: APP_URLS.settings_Profile,
  //   component: lazy(() => import('pages/SettingsPage')),
  // },
  // {
  //   path: APP_URLS.settings_2FA,
  //   component: lazy(() => import('pages/TwoFAPage')),
  // },
];
const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
});

const Router = ({ history, routerAnimation }) => {
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Route
          render={state => {
            const { location } = state;
            return (
              <SwitchTransition>
                <CSSTransition
                  key={location.pathname}
                  appear
                  classNames={routerAnimation}
                  timeout={routerAnimation === 'none' ? 0 : 300}
                >
                  <Switch location={location}>
                    <Route exact path="/" render={() => <Redirect to={APP_URLS.dashboard} />} />
                    {routes.map(({ path, Component, exact }) => (
                      <Route
                        path={path}
                        key={path}
                        exact={exact === void 0 || exact || false} // set true as default
                        render={() => {
                          return (
                            <div className={routerAnimation}>
                              <Suspense fallback={null}>
                                <Component />
                              </Suspense>
                            </div>
                          );
                        }}
                      />
                    ))}
                    <Redirect to="/auth/404" />
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            );
          }}
        />
      </Layout>
    </ConnectedRouter>
  );
};

export default connect(mapStateToProps)(Router);
