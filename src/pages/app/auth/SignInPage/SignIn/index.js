import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Input, Form, Alert, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { APP_URLS } from 'constants/APP_URLS';
import Recaptcha from 'components/app/Recaptcha';
import classNames from 'classnames';
import style from 'components/styles/custom.module.scss';
import { signInAction, AuthActions, cleanAuthErrorAction } from 'redux/auth';
import { appConfig } from 'config.js';

const mapStateToProps = ({ dispatch, auth }) => ({
  dispatch,
  authError: (auth.stateErrors && auth.stateErrors[AuthActions.SIGN_IN]) || {},
  isLoading: auth.isLoading,
});

const mapDispatchToProps = dispatch => ({
  doSignIn: data => {
    dispatch(signInAction(data));
  },
  doCleanUp: () => {
    dispatch(cleanAuthErrorAction());
  },
});

const Login = ({ authError, doSignIn, isLoading, doCleanUp }) => {
  const recaptchaInstance = useRef(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [rememberMe, setRememberMe] = useState(null);

  useEffect(() => doCleanUp, [doCleanUp]);

  const resetCaptcha = () => {
    return recaptchaInstance && recaptchaInstance.current && recaptchaInstance.current.reset();
  };

  const onFinish = async values => {
    if (values.email) setEmail(values.email);
    if (values.password) setPassword(values.password);

    if (isLoading) {
      return;
    }

    const data = {
      ...values,
      email: values.email || email,
      password: values.password || password,
      rememberMe,
    };

    doSignIn(data);
    resetCaptcha();
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const renderLogin = () => (
    <div>
      <img className="logo" src="/images/logo-auth.png" alt="Logo" />
      <div className="font-size-24 mb-3 text-center pt-3">
        <strong>Sign in</strong>
      </div>

      <Form
        layout="vertical"
        hideRequiredMark
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="mb-3"
        initialValues={{ email: 'hoanglong25588@gmail.com', password: '12345678' }}
      >
        <Form.Item
          label="Email address"
          name="email"
          rules={[
            { type: 'email', message: 'The input is not a valid e-mail address' },
            { required: true, message: 'Please input your e-mail address' },
          ]}
        >
          <Input size="large" placeholder="Email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input size="large" type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="captcha"
          rules={[{ required: appConfig.production, message: 'Please solve the captcha' }]}
        >
          <Recaptcha forwardRef={recaptchaInstance} />
        </Form.Item>

        {authError.errorMessage && (
          <Form.Item>
            <Alert message={authError.errorMessage} type="error" />
          </Form.Item>
        )}

        {authError.isNeedToVerifyEmail && (
          <Form.Item>
            <div className="verify-email-description ant-alert ant-alert-warning ant-alert-with-description ant-alert-no-icon">
              Your account need to verify email. Click{' '}
              <Link to={APP_URLS.sendVerifyEmail} className="kit__utils__link font-size-16">
                here
              </Link>{' '}
              to send a verify email.
            </div>
          </Form.Item>
        )}

        <Form.Item name="rememberMe">
          <Checkbox
            style={{ marginTop: '10px', marginLeft: '5px' }}
            onChange={e => setRememberMe(e.target.checked)}
          >
            Remember me
          </Checkbox>
          <button type="submit" className={classNames(style.btn, 'width-150', 'height-40')}>
            Sign In
          </button>
        </Form.Item>
      </Form>

      <div className="form-actions separator clearfix" />

      <Link to={APP_URLS.forgotPassword} className="kit__utils__link font-size-16 pull-left">
        Forgot Password?
      </Link>

      <Link to={APP_URLS.signUp} className="kit__utils__link font-size-16 pull-right">
        Sign up
      </Link>
    </div>
  );

  const render2FA = () => (
    <div>
      <img className="logo" src="/images/logo-auth.png" alt="Logo" />
      <div className="text-dark font-size-24 mb-3">
        <strong>Two-factor authentication</strong>
      </div>

      <Form
        layout="vertical"
        hideRequiredMark
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="mb-3"
      >
        <Form.Item
          label="Authenticator App Token"
          name="twoFAToken"
          rules={[{ required: true, message: 'Please enter your authentication token' }]}
        >
          <Input size="default" placeholder="" />
        </Form.Item>

        <Form.Item
          name="captcha"
          rules={[{ required: appConfig.production, message: 'Please solve the captcha' }]}
        >
          <Recaptcha forwardRef={recaptchaInstance} />
        </Form.Item>

        <Form.Item>
          <button type="submit" className={classNames(style.btn, 'width-150', 'height-40')}>
            Sign In
          </button>
        </Form.Item>
      </Form>
      <div className="form-actions separator clearfix" />
      <div className="text-center mb-auto">
        <Link to={APP_URLS.signIn} className="kit__utils__link font-size-16">
          Back to sign in page
        </Link>
      </div>
    </div>
  );

  return authError.isShown2FAForm ? render2FA() : renderLogin();
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
