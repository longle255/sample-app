import { Form, Input, Alert } from 'antd';
import Button from 'components/app/Button';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { confirm2FAAction, enable2FAAction, UserActions } from 'redux/user';
import './style.scss';

const Enable2FACard = ({
  userProfile,
  twoFASettings,
  enable2FA,
  confirm2FA,
  intl,
  isLoading,
  error,
}) => {
  React.useEffect(() => {
    enable2FA();
  }, [enable2FA]);

  const onFinish = async values => {
    if (isLoading) {
      return;
    }

    const data = {
      twoFAToken: values.code,
    };

    confirm2FA(data);
  };

  if (!twoFASettings || !userProfile) {
    return null;
  }

  const qrImage = twoFASettings.qr;
  const code = twoFASettings.base32;
  if (!code) {
    return null;
  }

  return (
    <div className="card snode-card enable-2fa-card shadow-sm bg-white">
      <div className="card-header">
        <div className="utils__title">
          <strong>
            <FormattedMessage id="Enable2FACard.ENABLE_TWOFACTOR_AUTHENTICATION" />
          </strong>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-12">
            <h3>
              <FormattedMessage id="Enable2FACard.FOLLOW_THE_STEPS_BELOW_TO" />
            </h3>

            <div className="step-item-list">
              <div className="step-item">
                <h4 className="title">
                  <FormattedMessage id="Enable2FACard.1_DOWNLOAD_A_TWOFACTOR_AUTHENTICATION" />
                </h4>
              </div>
              <div className="step-item">
                <h4 className="title">
                  <FormattedMessage id="Enable2FACard.2_SCAN_THIS_QR_CODE" />
                </h4>
                <div className="content">
                  <div className="qr-block">
                    <img src={qrImage} alt="QR" />
                  </div>

                  <div className="description">
                    <strong>
                      <FormattedMessage id="Enable2FACard.CANT_SCAN_THE_CODE" />
                    </strong>
                    <FormattedMessage id="Enable2FACard.YOU_CAN_ADD_THE_CODE" />
                  </div>
                  <div className="description">
                    <strong>
                      <FormattedMessage id="Enable2FACard.ACCOUNT" />
                    </strong>{' '}
                    {userProfile.email}
                  </div>
                  <div className="description">
                    <strong>
                      <FormattedMessage id="Enable2FACard.KEY" />
                    </strong>{' '}
                    <code>{code.match(/(.{1,4})/g).join(' ')}</code>
                  </div>
                  <div className="description">
                    <strong>
                      <FormattedMessage id="Enable2FACard.TIME_BASED" />
                    </strong>{' '}
                    <FormattedMessage id="Enable2FACard.YES" />
                  </div>
                </div>
              </div>
              <div className="step-item">
                <h4 className="title">
                  <FormattedMessage id="Enable2FACard.3_ENTER_THE_CODE_FROM" />
                </h4>
                <div className="content">
                  <div className="row">
                    <div className="col-md-6">
                      <Form onFinish={onFinish} className="enable-2fa-form">
                        <Form.Item
                          label={intl.formatMessage({ id: 'Enable2FACard.CODE' })}
                          name="code"
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({
                                id: 'Enable2FACard.PLEASE_PROVIDE_THE_CODE',
                              }),
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        {error && (
                          <Form.Item label=" " colon={false}>
                            <Alert message={error.message} type="error" />
                          </Form.Item>
                        )}
                        <Form.Item>
                          <Button loading={isLoading}>
                            <FormattedMessage id="Enable2FACard.ENABLE" />
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({
  twoFASettings: user.twoFA,
  isLoading: user.twoFA?.isLoading,
  error:
    (user.twoFA?.stateErrors && user.twoFA?.stateErrors[UserActions.CONFIRM_2FA]) ||
    (user.twoFA?.stateErrors && user.twoFA?.stateErrors[UserActions.ENABLE_2FA]),
});

const mapDispatchToProps = (dispatch: any) => ({
  enable2FA: () => {
    dispatch(enable2FAAction());
  },
  confirm2FA: data => {
    dispatch(confirm2FAAction(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Enable2FACard));
