import React from 'react'
import { Helmet } from 'react-helmet'

class DashboardBeta extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Dashboard: Beta" />
        <h5 className="mb-4">
          <span className="text-uppercase">Dashboard: Beta</span>
        </h5>
      </div>
    )
  }
}

export default DashboardBeta
