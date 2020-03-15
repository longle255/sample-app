import React from 'react'
import { Helmet } from 'react-helmet'

class DashboardGamma extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Dashboard: Gamma" />
        <h5 className="mb-4">
          <span className="text-uppercase">Dashboard: Gamma</span>
        </h5>
      </div>
    )
  }
}

export default DashboardGamma
