import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import qs from 'qs';
import trim from 'lodash-es/trim';
import { Input, Form, Checkbox, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { siteConfig, appConfig } from 'config.js';
import Recaptcha from 'components/app/Recaptcha';
import style from 'components/styles/custom.module.scss';
import { APP_URLS } from 'constants/APP_URLS';
import classNames from 'classnames';
import { signUpAction, AuthActions, cleanAuthErrorAction } from 'redux/auth';

const mapStateToProps = ({ dispatch, auth, router }) => ({
  dispatch,
  regSuccess: auth.success,
  regError: (auth.stateErrors && auth.stateErrors[AuthActions.SIGN_UP]) || {},
  isLoading: auth.isLoading,
  router,
});

const mapDispatchToProps = dispatch => ({
  doSignUp: data => {
    dispatch(signUpAction(data));
  },
  doCleanUp: () => {
    dispatch(cleanAuthErrorAction());
  },
});

const Register = ({ router, doSignUp, doCleanUp, regSuccess, regError, isLoading }) => {
  const urlParams = qs.parse(router.location.search.replace('?', ''));
  const ref = trim(urlParams.ref);
  const isReadOnlyReferralInput = !!ref;
  const recaptchaInstance = useRef(null);
  const [setErrorMessage] = useState(null);

  useEffect(() => doCleanUp, [doCleanUp]);

  const resetCaptcha = () => {
    return recaptchaInstance && recaptchaInstance.current && recaptchaInstance.current.reset();
  };

  const onFinish = async values => {
    if (!values.agreeTOS) {
      setErrorMessage('You have to read and accept our Terms of service.');
      return;
    }

    if (isLoading) {
      return;
    }

    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      referral: trim(values.referralCode),
      captcha: values.captcha,
    };

    if (!data.referral) {
      delete data.referral;
    }

    doSignUp(data);
    resetCaptcha();
  };

  const renderSignUp = () => (
    <div>
      <img className="logo" src="/images/logo-auth.png" alt="Logo" />
      <div className="font-size-24 mb-3 text-center pt-3">
        <strong>Sign up</strong>
      </div>

      <Form layout="vertical" hideRequiredMark onFinish={onFinish} className="mb-3">
        <Form.Item label="Your name">
          <Input.Group compact>
            <Form.Item
              name="firstName"
              noStyle
              rules={[
                { required: true, message: 'Please enter your first name' },
                { min: 2, message: 'Your name must be at least 2 characters.' },
              ]}
            >
              <Input style={{ width: '40%' }} placeholder="First name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              noStyle
              rules={[
                { required: true, message: 'Please enter your last name' },
                { min: 2, message: 'Your name must be at least 2 characters.' },
              ]}
            >
              <Input style={{ width: '60%' }} placeholder="Last name" />
            </Form.Item>
          </Input.Group>
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
          name="agreeTOS"
          valuePropName="checked"
          rules={[{ required: true, message: 'You have to agree with our Terms of service' }]}
        >
          <Checkbox>
            I agree with{' '}
            <Link target="_blank" rel="noopener noreferrer" to={siteConfig.tosLink}>
              Terms of service
            </Link>
          </Checkbox>
        </Form.Item>

        <Form.Item
          name="captcha"
          rules={[{ required: appConfig.production, message: 'Please solve the captcha' }]}
        >
          <Recaptcha forwardRef={recaptchaInstance} />
        </Form.Item>

        {regError.errorMessage && (
          <Form.Item>
            <Alert message={regError.errorMessage} type="error" />
          </Form.Item>
        )}

        <Form.Item>
          <button type="submit" className={classNames(style.btn, 'width-150', 'height-40')}>
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

  const renderRegisterSuccess = () => (
    <div>
      <img className="logo" src="/images/logo-auth.png" alt="Logo" />
      <div className="font-size-24 mb-3 text-center pt-3">
        <strong>Sign up</strong>
      </div>
      <div className="reset-password-success-description mb-5">
        Your account has been successfully created. Please check your inbox for confirmation email.
      </div>
      <div className="form-actions separator clearfix" />
      <div className="text-center mb-auto">
        <Link to={APP_URLS.signIn} className="kit__utils__link font-size-16">
          Back to sign in page
        </Link>
      </div>
    </div>
  );

  if (regSuccess) {
    return renderRegisterSuccess();
  }

  return renderSignUp();
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
