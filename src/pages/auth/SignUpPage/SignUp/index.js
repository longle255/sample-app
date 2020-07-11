import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import qs from 'qs';
import trim from 'lodash-es/trim';
import { Input, Button, Form, Checkbox, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { siteConfig } from 'config.js';
import { FormHelper } from 'helpers/FormHelper';
import Recaptcha from 'components/app/Recaptcha';
import style from 'components/styles/custom.module.scss';
import { APP_URLS } from 'constants/APP_URLS';
import classNames from 'classnames';

const mapStateToProps = ({ auth, dispatch, router }) => ({ auth, dispatch, router });

const Register = ({ dispatch, auth, router }) => {
  const urlParams = qs.parse(router.location.search.replace('?', ''));
  const ref = trim(urlParams.ref);

  const isReadOnlyReferralInput = !!ref;

  const recaptchaInstance = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isShown2FAForm, setIsShown2FAForm] = useState(false);
  const [isNeedToVerifyEmail, setIsNeedToVerifyEmail] = useState(false);

  const onFinish = values => {
    dispatch({
      type: 'auth/REGISTER',
      payload: values,
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <img className="logo" src="/images/logo-auth.png" alt="Logo" />
      <div className="font-size-24 mb-3 text-center pt-3">
        <strong>Sign up</strong>
      </div>

      <Form
        layout="vertical"
        hideRequiredMark
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="mb-3"
      >
        <Form.Item
          label="Your name"
          name="name"
          rules={[
            { required: true, message: 'Please input your name' },
            { min: 3, message: 'Your name must be at least 3 characters.' },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Email address"
          name="email"
          rules={[
            { type: 'email', message: 'The input is not a valid e-mail address' },
            { required: true, message: 'Please input your e-mail address' },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password.' },
            { min: 8, message: 'The password must be at least 8 characters.' },
          ]}
        >
          <Input size="large" type="password" />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="confirm-password"
          rules={[
            { required: true, message: 'Please confirm your password.' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!'),
                );
              },
            }),
          ]}
        >
          <Input size="large" type="password" />
        </Form.Item>

        <Form.Item label="Referral code" name="referralCode" initialValue={ref}>
          <Input disabled={isReadOnlyReferralInput} />
        </Form.Item>

        <Form.Item
          valuePropName="checked"
          rules={[{ required: true, message: 'Please check the Terms of service' }]}
        >
          <Checkbox className="remember-me">
            I agree with{' '}
            <Link target="_blank" rel="noopener noreferrer" to={siteConfig.tosLink}>
              Terms of service
            </Link>
          </Checkbox>
        </Form.Item>

        <Form.Item name="captcha" rules={[{ required: true, message: 'Please solve the captcha' }]}>
          <Recaptcha forwardRef={recaptchaInstance} />
        </Form.Item>

        {errorMessage && (
          <Form.Item>
            <Alert message={errorMessage} type="error" />
          </Form.Item>
        )}

        <Form.Item>
          <button type="button" className={classNames(style.btn, 'width-150', 'height-40')}>
            Sign Up
          </button>
        </Form.Item>
      </Form>
      <div className="form-actions separator clearfix" />
      <div className="text-center mb-auto">
        <span className="mr-2">Already have an account?</span>
        <Link to={APP_URLS.signIn} className="kit__utils__link font-size-16">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(Register);
