import { Form, Input, Alert } from 'antd';
import Button from 'components/app/Button';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { disable2FAAction, UserActions } from 'redux/user';
import './style.scss';

const Disable2FACard = ({ disable2FA, intl, isLoading, error }) => {
  const onFinish = async values => {
    if (isLoading) {
      return;
    }

    const data = {
      twoFAToken: values.code,
      password: values.password,
    };

    disable2FA(data);
  };

  return (
    <div className="card snode-card disable-2fa-card shadow-sm bg-white">
      <div className="card-header">
        <div className="utils__title">
          <strong>
            <FormattedMessage id="Disable2FACard.DISABLE_TWOFACTOR_AUTHENTICATION" />
          </strong>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-12">
            <div className="step-item-list">
              <div className="step-item">
                <h4 className="title">
                  <FormattedMessage id="Disable2FACard.ENTER_THE_CODE_FROM_YOUR" />
                </h4>
                <div className="content">
                  <div className="row">
                    <div className="col-md-4">
                      <Form onFinish={onFinish} className="disable-2fa-form">
                        <Form.Item
                          label={intl.formatMessage({ id: 'Disable2FACard.PASSWORD' })}
                          name="password"
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({
                                id: 'Disable2FACard.PLEASE_PROVIDE_THE_PASSWORD',
                              }),
                            },
                          ]}
                        >
                          <Input type="password" />
                        </Form.Item>

                        <Form.Item
                          label={intl.formatMessage({ id: 'Disable2FACard.CODE' })}
                          name="code"
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({
                                id: 'Disable2FACard.PLEASE_PROVIDE_THE_CODE',
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
                            <FormattedMessage id="Disable2FACard.DISABLE" />
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
  error: user.twoFA?.stateErrors && user.twoFA?.stateErrors[UserActions.DISABLE_2FA],
});

const mapDispatchToProps = (dispatch: any) => ({
  disable2FA: data => {
    dispatch(disable2FAAction(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Disable2FACard));
