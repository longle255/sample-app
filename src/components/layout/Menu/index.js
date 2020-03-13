import React from 'react'
import { Drawer } from 'antd'
import { connect } from 'react-redux'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import style from './style.module.scss'

const mapStateToProps = ({ settings }) => ({
  menuLayoutType: settings.menuLayoutType,
  isMobileMenuOpen: settings.isMobileMenuOpen,
  isMobileView: settings.isMobileView,
  leftMenuWidth: settings.leftMenuWidth,
})

@connect(mapStateToProps)
class Menu extends React.PureComponent {
  toggleMobileMenu = () => {
    const { dispatch, isMobileMenuOpen } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMobileMenuOpen',
        value: !isMobileMenuOpen,
      },
    })
  }

  render() {
    const { isMobileMenuOpen, isMobileView, menuLayoutType, leftMenuWidth } = this.props

    const Menu = () => {
      if (isMobileView) {
        return (
          <div>
            <div className={style.handler} onClick={this.toggleMobileMenu}>
              <div className={style.handlerIcon}></div>
            </div>
            <Drawer
              closable={false}
              visible={isMobileMenuOpen}
              placement="left"
              wrapClassName={style.mobileMenu}
              onClose={this.toggleMobileMenu}
              maskClosable={true}
              getContainer={null}
              width={leftMenuWidth}
            >
              <MenuLeft />
            </Drawer>
          </div>
        )
      }
      if (menuLayoutType === 'top') {
        return <MenuTop />
      }
      if (menuLayoutType === 'nomenu') {
        return null
      }
      return <MenuLeft />
    }

    return Menu()
  }
}

export default Menu
