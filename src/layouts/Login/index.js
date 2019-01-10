import React from 'react'
import { Layout } from 'antd'
import Link from 'umi/link'
import styles from './style.module.scss'

export default class LoginLayout extends React.PureComponent {
  render() {
    const { children } = this.props

    return (
      <Layout>
        <Layout.Content>
          <div className={styles.layout}>
            <div className={styles.header}>
              <div className="row">
                <div className="col-lg-12">
                  <div className={styles.logo}>
                    <Link to="/">
                      <img src="resources/images/logo.png" alt="Clean UI React Admin Template" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.content}>{children}</div>
            <div className={`${styles.footer} text-center`}>
              <ul className="list-unstyled list-inline mb-3">
                <li className="list-inline-item">
                  <a href="javascript: void(0);">Terms of Use</a>
                </li>
                <li className="active list-inline-item">
                  <a href="javascript: void(0);">Compliance</a>
                </li>
                <li className="list-inline-item">
                  <a href="javascript: void(0);">Confidential Information</a>
                </li>
                <li className="list-inline-item">
                  <a href="javascript: void(0);">Support</a>
                </li>
                <li className="list-inline-item">
                  <a href="javascript: void(0);">Contacts</a>
                </li>
              </ul>
              <p>&copy; 2019 Mediatec. All rights reserved.</p>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    )
  }
}
