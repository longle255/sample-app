import React from 'react';
import { connect } from 'react-redux';
import { getUserProfileAction } from 'redux/user';
import qs from 'qs';
import trim from 'lodash-es/trim';
// import RightBanner from 'components/RightBanner';
import Enable2FACard from './Enable2FACard';
import Disable2FACard from './Disable2FACard';
import TwoFAStatus from './TwoFAStatus';

const mapStateToProps = (state: any) => ({
  userProfile: state.user.profile,
  router: state.router,
});

const mapDispatchToProps = (dispatch: any) => ({
  getUserProfile: () => {
    dispatch(getUserProfileAction());
  },
});

const TwoFA = ({ getUserProfile, userProfile, router }) => {
  React.useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);

  const getEdit2FAState = () => {
    const search = trim(router.location.search).replace('?', '');
    const obj = qs.parse(search);
    const { state } = obj;

    return state;
  };

  const edit2FAState = router && getEdit2FAState();
  console.log('edit2FAState', edit2FAState);
  return (
    <div className="two-factor-auth-container">
      <div className="row">
        <div className="col-lg-10">
          {!edit2FAState && <TwoFAStatus userProfile={userProfile} />}
          {edit2FAState === 'enable' && <Enable2FACard userProfile={userProfile} />}
          {edit2FAState === 'disable' && <Disable2FACard userProfile={userProfile} />}
        </div>
        <div className="col-md-2">{/* <RightBanner /> */}</div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TwoFA);
