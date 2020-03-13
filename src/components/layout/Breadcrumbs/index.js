import React from 'react'
import { Link } from 'react-router-dom'
import style from './style.module.scss'

class Breadcrumbs extends React.Component {
  render() {
    return (
      <div className={style.breadcrumbs}>
        <div className={style.path}>
          <Link to="/dashboard/alpha">Home</Link>
          <span>
            <span className={`${style.arrow} text-muted`} />
            <strong>Dashboard Analytics</strong>
          </span>
        </div>
      </div>
    )
  }
}

export default Breadcrumbs
