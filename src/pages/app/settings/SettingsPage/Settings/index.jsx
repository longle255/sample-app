import React from 'react';
import { connect } from 'react-redux';
import { getUserProfileAction } from 'redux/user';
import ProfileDetails from './ProfileDetails';
import Security from './Security';
import TwoFactorAuth from './TwoFactorAuth';

const mapStateToProps = (state: any) => ({
  userProfile: state.user.profile,
});

const mapDispatchToProps = (dispatch: any) => ({
  getUserProfile: () => {
    dispatch(getUserProfileAction());
  },
});

const Settings = ({ getUserProfile, userProfile }) => {
  React.useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  return (
    <div className="settings-container">
      <div className="row">
        <div className="col-lg-7">
          <ProfileDetails userProfile={userProfile} />
        </div>
        <div className="col-lg-3">
          <Security userProfile={userProfile} />
          <TwoFactorAuth userProfile={userProfile} />
        </div>
        <div className="col-md-2">{/* <RightBanner /> */}</div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
