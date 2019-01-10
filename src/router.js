import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => null,
  })

class Router extends React.Component {
  render() {
    return (
      <IndexLayout>
        <Switch>
          <Route path="/" component={loadable(() => import('pages/dashboard/alpha'))} />
          <Route component={NotFoundPage} />
        </Switch>
      </IndexLayout>
    )
  }
}

export default Router