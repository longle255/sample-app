import React, { useRef } from 'react';
import { Input, Button, Form } from 'antd';
import { Link } from 'react-router-dom';
import { APP_URLS } from 'constants/APP_URLS';
import Recaptcha from 'components/app/Recaptcha';
import style from 'components/styles/custom.module.scss';
import classNames from 'classnames';

const ForgotPassword = () => {
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
        <strong>Forgot Password</strong>
      </div>
      <Form
        layout="vertical"
        hideRequiredMark
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="mb-4"
      >
        <Form.Item
          name="email"
          rules={[
            { type: 'email', message: 'The input is not a valid e-mail address' },
            { required: true, message: 'Please input your e-mail address' },
          ]}
        >
          <Input size="large" placeholder="Email Address" />
        </Form.Item>

        <Form.Item name="captcha" rules={[{ required: true, message: 'Please solve the captcha' }]}>
          <Recaptcha forwardRef={recaptchaInstance} />
        </Form.Item>

        <Form.Item>
          <button type="button" className={classNames(style.btn, 'width-150', 'height-40')}>
            Send Request
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

export default ForgotPassword;
