import { Switch } from 'antd';
import React from 'react';
import { connect } from 'react-redux';

import { UserActions } from 'redux/user';

const TwoFactorAuth = ({ userProfile, showEnable2FAForm, showDisable2FAForm }) => {
  const onChange = checked => {
    if (checked) {
      showEnable2FAForm(userProfile);
    } else {
      showDisable2FAForm(userProfile);
    }
  };

  return (
    <div className="card stakingsclub-card change-password-card shadow-sm bg-white">
      <div className="card-header">
        <div className="utils__title">
          <strong>Two-factor Authentication</strong>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-8">Status</div>
          <div className="col-md-4">
            <Switch checked={userProfile.twoFAEnabled} onChange={onChange} className="pull-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) => ({
  showEnable2FAForm: () => {
    dispatch({ type: UserActions.SHOW_2FA_ENABLE_FORM });
  },
  showDisable2FAForm: () => {
    dispatch({ type: UserActions.SHOW_2FA_DISABLE_FORM });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TwoFactorAuth);
