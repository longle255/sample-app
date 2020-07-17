import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Input } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { referralService } from 'services';
import './style.scss';

const { Search } = Input;

const ReferralCode = ({ userProfile, intl }) => {
  const [isCopied, setIsCopied] = React.useState(null);

  const onCopy = () => {
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  if (!userProfile) {
    return null;
  }

  const { referralCode } = userProfile;
  const referrerLink = referralService.getReferralLink({ code: referralCode });

  return (
    <div className="card shadow-sm bg-white referral-code-card">
      <div className="wrapper">
        <div className="referral-code-card-header">
          <div className="utils__title">
            <strong>
              <FormattedMessage id="ReferralPage.ReferralCode.CODE" />
            </strong>
          </div>
          <div className="utils__titleDescription">
            <FormattedMessage id="ReferralPage.ReferralCode.YOU_CAN_COPY_THIS_CODE" />
          </div>
        </div>
        <div className="referral-code-card-body mt-3">
          <CopyToClipboard text={referrerLink} onCopy={onCopy}>
            <div className="copy-to-clipboard-info">
              <Search
                defaultValue={referralCode}
                enterButton={intl.formatMessage({
                  id: 'ReferralPage.ReferralCode.COPY',
                })}
              />
              {isCopied && (
                <span className="copied-text">
                  <CheckOutlined />
                  <FormattedMessage id="ReferralPage.ReferralCode.COPIED" />
                </span>
              )}
            </div>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  userProfile: state.user.profile,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ReferralCode));
