import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Avatar, Badge } from 'antd';
import { signOutAction } from 'redux/auth';
import { APP_URLS } from 'constants/APP_URLS';
import styles from './style.module.scss';

const mapStateToProps = ({ user: { profile } }) => ({ profile });
const mapDispatchToProps = dispatch => ({
  doSignOut: () => {
    dispatch(signOutAction());
  },
});

const ProfileMenu = ({ profile, doSignOut }) => {
  if (!profile) return null;

  const logout = e => {
    e.preventDefault();
    doSignOut();
  };

  const menu = (
    <Menu selectable={false}>
      <Menu.Item>
        <strong>
          <FormattedMessage id="topBar.profileMenu.hello" />, {profile.firstName || 'Anonymous'}
        </strong>
        <div>
          <strong className="mr-1">
            <FormattedMessage id="topBar.profileMenu.billingPlan" />:{' '}
          </strong>
          Professional
        </div>
        <div>
          <strong>
            <FormattedMessage id="topBar.profileMenu.role" />:{' '}
          </strong>
          {profile.role || '—'}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <div>
          <strong>
            <FormattedMessage id="topBar.profileMenu.email" />:{' '}
          </strong>
          {profile.email || '—'}
          <br />
          <strong>
            <FormattedMessage id="topBar.profileMenu.phone" />:{' '}
          </strong>
          {profile.phone || '—'}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Link to={APP_URLS.settings_Profile}>
          <i className="fe fe-user mr-2" />
          <FormattedMessage id="topBar.profileMenu.editProfile" />
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a href="#" onClick={logout}>
          <i className="fe fe-log-out mr-2" />
          <FormattedMessage id="topBar.profileMenu.logout" />
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div className={styles.dropdown}>
        <Badge count={0}>
          <Avatar className={styles.avatar} shape="square" size="large" icon={<UserOutlined />} />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);
