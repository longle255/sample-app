import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import style from './style.module.scss';

const mapStateToProps = ({ settings }) => ({
  logo: settings.logo,
});

const AuthLayout = ({ children }) => {
  return (
    <Layout>
      <Layout.Content>
        <div className={classNames(style.auth, style.auth__fullscreen)}>
          <div className={classNames(style.auth__block, style.auth__block__extended, 'pb-0')}>
            <div className={classNames(style.auth__block__inner)}>
              <div className={classNames(style.auth__block__form)}>{children}</div>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default withRouter(connect(mapStateToProps)(AuthLayout));
