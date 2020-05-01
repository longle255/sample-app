import React from 'react'
import { Helmet } from 'react-helmet'
import ForgotPassword from 'components/cui-system/Auth/ForgotPassword'

class SystemForgotPassword extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Forgot Password" />
        <ForgotPassword />
      </div>
    )
  }
}

export default SystemForgotPassword
