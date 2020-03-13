import React from 'react'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import TopBar from 'components/layout/TopBar'
import Breadcrumbs from 'components/layout/Breadcrumbs'
import Menu from 'components/layout/Menu'
import Footer from 'components/layout/Footer'
import Sidebar from 'components/layout/Sidebar'
import SupportChat from 'components/layout/SupportChat'

const mapStateToProps = ({ settings }) => ({ settings })

@withRouter
@connect(mapStateToProps)
class MainLayout extends React.PureComponent {
  render() {
    const {
      children,
      settings: {
        isContentNoMaxWidth,
        isAppMaxWidth,
        isGrayBackground,
        isSquaredBorders,
        isCardShadow,
        isBorderless,
        isTopbarFixed,
        isGrayTopbar,
      },
    } = this.props

    return (
      <div className={classNames({ cui__layout__grayBackground: isGrayBackground })}>
        <Layout
          className={classNames({
            cui__layout__contentNoMaxWidth: isContentNoMaxWidth,
            cui__layout__appMaxWidth: isAppMaxWidth,
            cui__layout__grayBackground: isGrayBackground,
            cui__layout__squaredBorders: isSquaredBorders,
            cui__layout__cardsShadow: isCardShadow,
            cui__layout__borderless: isBorderless,
          })}
        >
          <Sidebar />
          <SupportChat />
          <Menu />
          <Layout>
            <Layout.Header
              className={classNames('cui__layout__header', {
                cui__layout__fixedHeader: isTopbarFixed,
                cui__layout__headerGray: isGrayTopbar,
              })}
            >
              <TopBar />
            </Layout.Header>
            <Breadcrumbs />
            <Layout.Content style={{ height: '100%', position: 'relative' }}>
              <div className="cui__utils__content">{children}</div>
            </Layout.Content>
            <Layout.Footer>
              <Footer />
            </Layout.Footer>
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default MainLayout
