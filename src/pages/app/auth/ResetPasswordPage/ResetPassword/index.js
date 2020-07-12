import React, { useState } from 'react';
import { connect } from 'react-redux';
import qs from 'qs';
import trim from 'lodash-es/trim';
import { Link, Redirect } from 'react-router-dom';
import { Input, Form, Alert } from 'antd';
import { APP_URLS } from 'constants/APP_URLS';
import style from 'components/styles/custom.module.scss';
import classNames from 'classnames';
import { authService } from 'services/AuthService';

const mapStateToProps = ({ dispatch, router }) => ({ dispatch, router });

const ResetPassword = ({ router }) => {
  const urlParams = qs.parse(router.location.search.replace('?', ''));
  const token = trim(urlParams.token);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInvalidToken, setIsInvalidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  if (!token) {
    return <Redirect to={APP_URLS.signIn} />;
  }

  const onFinish = async values => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const data = {
        password: values.password,
        token,
      };

      await authService.resetPassword(data);
      setIsProcessing(false);
      setIsSuccess(true);
    } catch (errorInfo) {
      setIsProcessing(false);
      const errorMessage = errorInfo.message;
      // const { errors } = errorInfo;
      const responseData = errorInfo.response.data;
      if (responseData.message === 'Token is invalid') {
        setIsInvalidToken(true);
      }

      setErrorMessage(errorMessage);
    }
  };

  const renderResetPasswordSuccess = () => {
    return (
      <div>
        <img className="logo" src="/images/logo-auth.png" alt="Logo" />
        <div className="font-size-24 mb-3 text-center pt-3">
          <strong>Reset password success</strong>
        </div>
        <div>Your password has been changed. Please go to sign in page to login.</div>
        <div className="form-actions separator clearfix" />
        <div className="text-center mb-auto">
          <Link to={APP_URLS.signIn} className="kit__utils__link font-size-16">
            Back to sign in page
          </Link>
        </div>
      </div>
    );
  };

  const renderInvalidToken = () => {
    return (
      <div>
        <img className="logo" src="/images/logo-auth.png" alt="Logo" />
        <div className="font-size-24 mb-3 text-center pt-3">
          <strong>Account confirmation</strong>
        </div>

        <div className="verify-email-success-description mb-5">
          The token is invalid or expired. Click{' '}
          <Link to={APP_URLS.forgotPassword} className="kit__utils__link font-size-16">
            here
          </Link>{' '}
          to go to Forgot password page.
        </div>
      </div>
    );
  };

  if (isSuccess) {
    return renderResetPasswordSuccess();
  }

  if (isInvalidToken) {
    return renderInvalidToken();
  }

  return (
    <div>
      <img className="logo" src="/images/logo-auth.png" alt="Logo" />
      <div className="font-size-24 mb-3 text-center pt-3">
        <strong>Reset Password</strong>
      </div>
      <Form layout="vertical" hideRequiredMark onFinish={onFinish} className="mb-4">
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

        {errorMessage && (
          <Form.Item>
            <Alert message={errorMessage} type="error" />
          </Form.Item>
        )}

        <Form.Item>
          <button type="submit" className={classNames(style.btn, 'width-150', 'height-40')}>
            Reset Password
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
};

export default connect(mapStateToProps)(ResetPassword);
