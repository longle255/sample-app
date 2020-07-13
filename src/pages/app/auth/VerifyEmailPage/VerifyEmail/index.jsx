import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import qs from 'qs';
import trim from 'lodash-es/trim';
import { Form } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import Button from 'components/app/Button';
import { APP_URLS } from 'constants/APP_URLS';
import Recaptcha from 'components/app/Recaptcha';
import { authService } from 'services/AuthService';

const mapStateToProps = ({ dispatch, router }) => ({ dispatch, router });

const VerifyEmail = ({ router }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalidToken, setIsInvalidToken] = useState(false);

  const urlParams = qs.parse(router.location.search.replace('?', ''));
  const token = trim(urlParams.token);
  const recaptchaInstance = useRef(null);
  if (!token) {
    return <Redirect to={APP_URLS.signIn} />;
  }

  const resetCaptcha = () => {
    return recaptchaInstance && recaptchaInstance.current && recaptchaInstance.current.reset();
  };

  const onFinish = async values => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      await authService.verifyEmail({
        ...values,
        token,
      });
      setIsProcessing(false);
      setIsSuccess(true);
    } catch (errorInfo) {
      setIsProcessing(false);
      setIsInvalidToken(true);
    }
    resetCaptcha();
  };

  const renderInvalidToken = () => {
    return (
      <div>
        <img className="logo" src="/images/logo-auth.png" alt="Logo" />
        <div className="font-size-24 mb-3 text-center pt-3">
          <strong>Account confirmation</strong>
        </div>

        <div className="verify-email-success-description mb-5">
          The token is invalid. Click{' '}
          <Link to={APP_URLS.sendVerifyEmail} className="kit__utils__link font-size-16">
            here
          </Link>{' '}
          to go to Send verify email page.
        </div>
      </div>
    );
  };

  const renderVerifyEmailSuccess = () => {
    return (
      <div>
        <img className="logo" src="/images/logo-auth.png" alt="Logo" />
        <div className="font-size-24 mb-3 text-center pt-3">
          <strong>Account confirmation</strong>
        </div>
        <div>Your email has been verified. Please login</div>
        <div className="form-actions separator clearfix" />
        <div className="text-center mb-auto">
          <Link to={APP_URLS.signIn} className="kit__utils__link font-size-16">
            Back to sign in page
          </Link>
        </div>
      </div>
    );
  };

  if (isSuccess) {
    return renderVerifyEmailSuccess();
  }

  if (isInvalidToken) {
    return renderInvalidToken();
  }

  return (
    <div>
      <img className="logo" src="/images/logo-auth.png" alt="Logo" />
      <div className="font-size-24 mb-3 text-center pt-3">
        <strong>Account confirmation</strong>
      </div>
      <Form layout="vertical" hideRequiredMark onFinish={onFinish} className="mb-4">
        <Form.Item
          label="Thank you for creating an account. Please active it by clicking button Verify."
          name="captcha"
          rules={[{ required: true, message: 'Please solve the captcha' }]}
        >
          <Recaptcha forwardRef={recaptchaInstance} />
        </Form.Item>

        <Form.Item>
          <Button loading={isProcessing}>Verify</Button>
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
export default connect(mapStateToProps)(VerifyEmail);
