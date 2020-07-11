import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Radio, Form, Tooltip, Alert, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { APP_URLS } from 'constants/APP_URLS';
import Recaptcha from 'components/app/Recaptcha';
import FormHelper from 'helpers/FormHelper';
import classNames from 'classnames';
import style from 'components/styles/custom.module.scss';

import { loginSucceedAction } from 'states/app';

const mapStateToProps = ({ auth, settings, dispatch }) => ({
  dispatch,
  auth,
  authProvider: settings.authProvider,
  logo: settings.logo,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loginSuccess: (result, fromUrl) => {
    dispatch(loginSucceedAction(result, fromUrl));
  },
});

const Login = ({ dispatch, auth, authProvider, logo }) => {
  const recaptchaInstance = useRef(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isShown2FAForm, setIsShown2FAForm] = useState(false);
  const [isNeedToVerifyEmail, setIsNeedToVerifyEmail] = useState(false);

  const onFinish = values => {
    setHasSubmitted(true);
    recaptchaInstance.current.reset();

    dispatch({
      type: 'user/LOGIN',
      payload: values,
    });
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
        initialValues={{ email: 'demo@sellpixels.com', password: 'demo123' }}
      >
        <Form.Item
          label="Email address"
          // className={FormHelper.getFormGroupClasses(state, form, 'email')}
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

        <Form.Item name="captcha" rules={[{ required: true, message: 'Please solve the captcha' }]}>
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
          <button type="button" className={classNames(style.btn, 'width-150', 'height-40')}>
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
        initialValues={{ email: 'demo@sellpixels.com', password: 'demo123' }}
      >
        <Form.Item
          label="Authenticator App Token"
          // className={FormHelper.getFormGroupClasses(state, form, 'email')}
          name="token"
          rules={[{ required: true, message: 'Please input your token' }]}
        >
          <Input size="default" placeholder="" />
        </Form.Item>

        <Form.Item name="captcha" rules={[{ required: true, message: 'Please solve the captcha' }]}>
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
          <button type="button" className={classNames(style.btnLogin, 'width-150', 'height-40')}>
            Sign In
          </button>
        </Form.Item>
      </Form>
    </div>
  );

  return isShown2FAForm ? render2FA() : renderLogin();
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
