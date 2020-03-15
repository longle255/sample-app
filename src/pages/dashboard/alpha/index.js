import React from 'react'
import { Helmet } from 'react-helmet'
import ACL from 'components/system/ACL'
import Chart11 from 'components/kit-widgets/Charts/11'
import Chart11v1 from 'components/kit-widgets/Charts/11-1'
import Chart11v2 from 'components/kit-widgets/Charts/11-2'

class DashboardAlpha extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Dashboard: Analytics" />
        <ACL roles={['manager']}>
          <div>Hidden element for all roles expect 'manager' role</div>
          <div>
            Next ACL component will redirect all roles except 'admin' role to 'dashboard/beta'
          </div>
        </ACL>
        <ACL roles={['admin']} redirect="/dashboard/beta">
          <div className="cui__utils__heading">Last Week Statistics</div>
          <div className="row">
            <div className="col-xl-4">
              <div className="card">
                <Chart11 />
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card">
                <Chart11v1 />
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card">
                <Chart11v2 />
              </div>
            </div>
          </div>
        </ACL>
      </div>
    )
  }
}

export default DashboardAlpha
