import { Form, Input, Alert } from 'antd';
import React from 'react';
import { profileService, notificationService } from 'services';
import Button from 'components/app/Button';

const Security = ({ userProfile }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const { twoFAEnabled } = userProfile;

  const onFinish = async values => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const data = {
        oldPassword: values.currentPassword,
        passwordConfirm: values.confirmPassword,
        password: values.newPassword,
        twoFAToken: values.code,
      };

      await profileService.changePassword(data);
      setIsProcessing(false);
      setErrorMessage(null);

      notificationService.showSuccessMessage('Password updated successful.', 'Password updated');
    } catch (errorInfo) {
      setIsProcessing(false);
      const errorMessage = errorInfo.message;
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="card shadow-sm bg-white">
      <div className="card-header">
        <div className="utils__title">
          <strong>Account Security</strong>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-12">
            <Form layout="vertical" hideRequiredMark onFinish={onFinish} className="mb-4">
              <Form.Item
                label="Current password"
                name="currentPassword"
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  { min: 8, message: 'The password must be at least 8 characters.' },
                ]}
              >
                <Input size="large" type="password" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="newPassword"
                rules={[
                  { required: true, message: 'Please input your password.' },
                  { min: 8, message: 'The password must be at least 8 characters.' },
                ]}
              >
                <Input size="large" type="password" />
              </Form.Item>

              <Form.Item
                label="Confirm password"
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Please confirm your password.' },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('newPassword') === value) {
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

              {twoFAEnabled && (
                <Form.Item
                  label="2FA Code"
                  name="code"
                  rules={[{ required: true, message: 'Please enter the 2FA code!' }]}
                >
                  <Input size="large" />
                </Form.Item>
              )}

              {errorMessage && (
                <Form.Item>
                  <Alert message={errorMessage} type="error" />
                </Form.Item>
              )}

              <Form.Item>
                <Button loading={isProcessing}>Reset password</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Security;
