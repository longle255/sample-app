import React, { useState, useRef } from 'react';
import { Input, Form, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { APP_URLS } from 'constants/APP_URLS';
import Recaptcha from 'components/app/Recaptcha';
import Button from 'components/app/Button';
import { authService } from 'services/AuthService';

const ForgotPassword = () => {
  const recaptchaInstance = useRef(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const resetCaptcha = () => {
    return recaptchaInstance && recaptchaInstance.current && recaptchaInstance.current.reset();
  };

  const onFinish = async values => {
    if (isProcessing) {
      return;
    }
    setIsProcessing(true);

    try {
      const result = await authService.sendVerifyEmail(values);
      const { message } = result;
      setIsProcessing(false);
      setErrorMessage(null);
      setSuccessMessage(message);
    } catch (errorInfo) {
      const errorMessage = errorInfo.message;
      setErrorMessage(errorMessage);
      setIsProcessing(false);
    }
    resetCaptcha();
  };

  return (
    <div>
      <img className="logo" src="/images/logo-auth.png" alt="Logo" />
      <div className="font-size-24 mb-3 text-center pt-3">
        <strong>Send confirm email</strong>
      </div>
      <Form layout="vertical" hideRequiredMark onFinish={onFinish} className="mb-4">
        <Form.Item
          name="email"
          label="Please provide the email address that you used when you signed up for your account. We will resend the confirmation email to activate your account."
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

        {successMessage && <Alert message={successMessage} type="success" />}
        {errorMessage && <Alert message={errorMessage} type="error" />}

        <Form.Item>
          <Button loading={isProcessing}>Send request</Button>
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
