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
    Component: lazy(() => import('pages/app/auth/SignInPage')),
  },
  {
    path: `${APP_URLS.signUp}:ref?`,
    Component: lazy(() => import('pages/app/auth/SignUpPage')),
  },
  {
    path: APP_URLS.forgotPassword,
    Component: lazy(() => import('pages/app/auth/ForgotPasswordPage')),
  },
  {
    path: APP_URLS.resetPassword,
    Component: lazy(() => import('pages/app/auth/ResetPasswordPage')),
  },
  {
    path: APP_URLS.verifyEmail,
    Component: lazy(() => import('pages/app/auth/VerifyEmailPage')),
  },
  {
    path: APP_URLS.sendVerifyEmail,
    Component: lazy(() => import('pages/app/auth/SendConfirmEmailPage')),
  },
  {
    path: APP_URLS.dashboard,
    Component: lazy(() => import('pages/app/DashboardPage')),
  },
  {
    path: APP_URLS.referral,
    Component: lazy(() => import('pages/app/referral/ReferralPage')),
  },
  {
    path: APP_URLS.bonus,
    Component: lazy(() => import('pages/app/referral/BonusPage')),
  },
  {
    path: APP_URLS.settings_Profile,
    Component: lazy(() => import('pages/app/settings/SettingsPage')),
  },
  {
    path: APP_URLS.settings_2FA,
    Component: lazy(() => import('pages/app/settings/TwoFAPage')),
  },
  {
    path: APP_URLS.notFound,
    Component: lazy(() => import('pages/app/404')),
  },
  {
    path: APP_URLS.error,
    Component: lazy(() => import('pages/app/500')),
  },
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
                    <Redirect to="/404" />
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
