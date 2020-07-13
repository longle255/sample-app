import React, { useState, useRef } from 'react';
import { Form, Alert } from 'antd';
import uniq from 'lodash-es/uniq';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import Recaptcha from 'components/app/Recaptcha';
import { notificationService, referralService } from 'services';
import './style.scss';
import Button from 'components/app/Button';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const SendInvitation = () => {
  const recaptchaInstance = useRef(null);

  const [tags, setTags] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const resetCaptcha = () => {
    return recaptchaInstance && recaptchaInstance.current && recaptchaInstance.current.reset();
  };

  const onFinish = async values => {
    if (isProcessing) {
      return;
    }
    setIsProcessing(true);

    const data = {
      emails: uniq(tags),
      captcha: values.captcha,
    };

    try {
      await referralService.sendInvitations(data);
      setIsProcessing(false);
      setErrorMessage(null);

      notificationService.showSuccessMessage('Invitaion was sent successful.');
      setTags([]);
    } catch (errorInfo) {
      const errorMessage = errorInfo.message;
      setErrorMessage(errorMessage);
      setIsProcessing(false);
    }
    resetCaptcha();
  };

  const renderInput = props => {
    const { onChange, value, addTag, placeholder, ...other } = props;
    return (
      <input type="email" placeholder="Add an email" onChange={onChange} value={value} {...other} />
    );
  };
  const pasteSplit = data => {
    const separators = [',', ';', '\\(', '\\)', '\\*', '/', ':', '\\?', '\n', '\r'];
    return data.split(new RegExp(separators.join('|'))).map(d => d.trim());
  };

  return (
    <div className="card send-invitatons-card shadow-sm bg-white">
      <div className="card-header">
        <div className="utils__title">
          <strong>Invite</strong>
        </div>
        <div className="utils__titleDescription">You can invite your friends by sending email</div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-12">
            <Form onFinish={onFinish} className="send-invitatons-form" autoComplete="off">
              <Form.Item
                label="Emails"
                rules={[
                  {
                    required: true,
                    message: 'Please input the emails',
                  },
                ]}
              >
                <TagsInput
                  className="email-list-tag"
                  renderInput={renderInput}
                  onChange={e => setTags(e)}
                  value={tags}
                  validationRegex={EMAIL_REGEX}
                  maxTags={30}
                  pasteSplit={pasteSplit}
                  onChangeInput={e => setTags(e)}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="captcha"
                rules={[{ required: true, message: 'Please solve the captcha' }]}
              >
                <Recaptcha forwardRef={recaptchaInstance} />
              </Form.Item>

              {errorMessage && (
                <Form.Item label=" " colon={false}>
                  <Alert message={errorMessage} type="error" />
                </Form.Item>
              )}
              <Form.Item>
                <Button loading={isProcessing}>Send Request</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendInvitation;
