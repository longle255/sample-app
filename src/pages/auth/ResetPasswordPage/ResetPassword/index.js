import React, { useRef } from 'react';
import { Input, Button, Form } from 'antd';
import { Link } from 'react-router-dom';
import { APP_URLS } from 'constants/APP_URLS';
import Recaptcha from 'components/app/Recaptcha';
import style from 'components/styles/custom.module.scss';
import classNames from 'classnames';

const ResetPassword = () => {
  const recaptchaInstance = useRef(null);

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <img className="logo" src="/images/logo-auth.png" alt="Logo" />
      <div className="font-size-24 mb-3 text-center pt-3">
        <strong>Reset Password</strong>
      </div>
      <Form
        layout="vertical"
        hideRequiredMark
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="mb-4"
      >
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

        <Form.Item>
          <button type="button" className={classNames(style.btn, 'width-150', 'height-40')}>
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

export default ResetPassword;
