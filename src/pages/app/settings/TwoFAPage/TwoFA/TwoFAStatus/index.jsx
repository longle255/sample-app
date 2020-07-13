import React from 'react';
import Button from 'components/app/Button';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { showEnable2FAFormAction, showDisable2FAFormAction } from 'redux/user';
import { Tag } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const TwoFAStatus = ({ userProfile, showEnable2FAForm, showDisable2FAForm }) => {
  const switch2FAState = () => {
    if (!userProfile.twoFAEnabled) {
      showEnable2FAForm(userProfile);
    } else {
      showDisable2FAForm(userProfile);
    }
  };
  const status = userProfile.twoFAEnabled ? (
    <Tag icon={<CheckCircleOutlined />} color="success">
      <FormattedMessage id="TwoFAPage.TwoFAStatus.ENABLED" />
    </Tag>
  ) : (
    <Tag icon={<ExclamationCircleOutlined />} color="warning">
      <FormattedMessage id="TwoFAPage.TwoFAStatus.DISABLED" />
    </Tag>
  );

  return (
    <div className="card snode-card two-fa-status-card shadow-sm bg-white">
      <div className="card-header">
        <div className="utils__title">
          <strong>
            <FormattedMessage id="TwoFAPage.TwoFAStatus.TWOFACTOR_AUTHENTICATION" />
          </strong>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-12">
            <div className="two-fa-status">
              <FormattedMessage id="TwoFAPage.TwoFAStatus.STATUS" values={{ status }} />
              <Button onClick={switch2FAState}>
                {!userProfile.twoFAEnabled ? (
                  <FormattedMessage id="TwoFAPage.TwoFAStatus.ENABLE" />
                ) : (
                  <FormattedMessage id="TwoFAPage.TwoFAStatus.DISABLE" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) => ({
  showEnable2FAForm: () => {
    dispatch(showEnable2FAFormAction());
  },
  showDisable2FAForm: () => {
    dispatch(showDisable2FAFormAction());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TwoFAStatus);
