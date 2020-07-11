import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Input, Form, Alert, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { APP_URLS } from 'constants/APP_URLS';
import Recaptcha from 'components/app/Recaptcha';
import classNames from 'classnames';
import { authService } from 'services/AuthService';
import style from 'components/styles/custom.module.scss';
import * as HttpStatus from 'http-status-codes';
import { loginSucceedAction } from 'states/auth';
import { appConfig } from 'config.js';

const mapStateToProps = ({ dispatch, app }) => ({
  dispatch,
  appState: app,
});

const mapDispatchToProps = dispatch => ({
  loginSuccess: (result, fromUrl) => {
    dispatch(loginSucceedAction(result, fromUrl));
  },
});

const Login = ({ loginSuccess, appState }) => {
  const recaptchaInstance = useRef(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isShown2FAForm, setIsShown2FAForm] = useState(false);
  const [isNeedToVerifyEmail, setIsNeedToVerifyEmail] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [captcha, setCaptcha] = useState(null);
  const [twoFAToken, setTwoFAToken] = useState(null);

  const resetCaptcha = () => {
    return recaptchaInstance && recaptchaInstance.current && recaptchaInstance.current.reset();
  };

  const onFinish = async values => {
    if (values.email) setEmail(values.email);
    if (values.password) setPassword(values.password);
    if (values.captcha) setCaptcha(values.captcha);
    if (values.twoFAToken) setTwoFAToken(values.twoFAToken);

    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const data = {
        ...values,
        email: values.email || email,
        password: values.password || password,
      };
      const result = await authService.logIn(data);
      const { from } = appState;
      setIsProcessing(false);
      setErrorMessage(null);
      loginSuccess(result, from);
    } catch (errorInfo) {
      const errorMessage = errorInfo.message;
      const response = errorInfo.response || {};
      const isNeedToVerifyEmail =
        errorMessage ===
        'Please confirm your email address by clicking the confirmation link in your email';
      if (isNeedToVerifyEmail) {
        setIsProcessing(false);
        setErrorMessage(null);
        setIsNeedToVerifyEmail(isNeedToVerifyEmail);
        return;
      }
      if (response.status === HttpStatus.FORBIDDEN) {
        const isWrongToken = errorMessage === 'Incorrect two-factor authentication token';
        setIsProcessing(false);
        setErrorMessage(isWrongToken ? errorMessage : null);
        setIsShown2FAForm(true);
        resetCaptcha();
        return;
      }

      if (response.status === HttpStatus.BAD_REQUEST) {
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage(errorMessage);
      }
      setIsProcessing(false);
      setErrorMessage(errorMessage);
      resetCaptcha();
    }
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

        {errorMessage && (
          <Form.Item>
            <Alert message={errorMessage} type="error" />
          </Form.Item>
        )}

        {isNeedToVerifyEmail && (
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

        <Form.Item>
          <Checkbox style={{ marginTop: '10px', marginLeft: '5px' }}> Remember me</Checkbox>
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

        {errorMessage && (
          <Form.Item>
            <Alert message={errorMessage} type="error" />
          </Form.Item>
        )}

        {isNeedToVerifyEmail && (
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

        <Form.Item>
          <button type="submit" className={classNames(style.btn, 'width-150', 'height-40')}>
            Sign In
          </button>
        </Form.Item>
      </Form>
    </div>
  );

  return isShown2FAForm ? render2FA() : renderLogin();
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
