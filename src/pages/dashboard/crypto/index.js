import React from 'react'
import { Helmet } from 'react-helmet'

class DashboardCrypto extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Dashboard: Crypto" />
        <h5 className="mb-4">
          <span className="text-uppercase">Dashboard: Crypto</span>
        </h5>
      </div>
    )
  }
}

export default DashboardCrypto
