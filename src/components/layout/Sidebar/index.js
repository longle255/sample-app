import React from 'react'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import { Switch, Radio, Select, Tooltip } from 'antd'
import { throttle } from 'lodash'
import classNames from 'classnames'
import style from './style.module.scss'

const mapStateToProps = ({ settings }) => ({
  isSidebarOpen: settings.isSidebarOpen,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMenuShadow: settings.isMenuShadow,
  isMenuUnfixed: settings.isMenuUnfixed,
  menuLayoutType: settings.menuLayoutType,
  menuColor: settings.menuColor,
  systemLayoutColor: settings.systemLayoutColor,
  isTopbarFixed: settings.isTopbarFixed,
  isContentNoMaxWidth: settings.isContentNoMaxWidth,
  isAppMaxWidth: settings.isAppMaxWidth,
  isGrayBackground: settings.isGrayBackground,
  isGrayTopbar: settings.isGrayTopbar,
  isCardShadow: settings.isCardShadow,
  isSquaredBorders: settings.isSquaredBorders,
  isBorderless: settings.isBorderless,
  routerAnimation: settings.routerAnimation,
  locale: settings.locale,
  theme: settings.theme,
  primaryColor: settings.primaryColor,
})

@connect(mapStateToProps)
class Sidebar extends React.Component {
  state = {
    primaryColor: this.props.primaryColor,
    defaultColor: '#4b7cf3',
  }

  switchDarkTheme = () => {
    const { dispatch } = this.props
    dispatch({ type: 'settings/TOGGLE_THEME' })
  }

  selectColor = throttle(color => {
    const { dispatch } = this.props
    this.setState({
      primaryColor: color,
    })
    dispatch({
      type: 'settings/SET_PRIMARY_COLOR',
      payload: {
        color,
      },
    })
  }, 200)

  resetColor = () => {
    const { defaultColor } = this.state
    const { dispatch } = this.props
    this.setState({
      primaryColor: defaultColor,
    })
    dispatch({
      type: 'settings/SET_PRIMARY_COLOR',
      payload: {
        color: defaultColor,
      },
    })
  }

  changeSetting = (setting, value) => {
    const { dispatch } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting,
        value,
      },
    })
  }

  toggleSettings = e => {
    e.preventDefault()
    const { dispatch, isSidebarOpen } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isSidebarOpen',
        value: !isSidebarOpen,
      },
    })
  }

  selectMenuType = e => {
    const { dispatch } = this.props
    const { value } = e.target
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'menuType',
        value,
      },
    })
  }

  selectMenuLayoutType = e => {
    const { dispatch } = this.props
    const { value } = e.target
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'menuLayoutType',
        value,
      },
    })
  }

  colorPickerHandler = (e, setting, value) => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting,
        value,
      },
    })
  }

  selectRouterAnimation = value => {
    const { dispatch } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'routerAnimation',
        value,
      },
    })
  }

  selectLocale = value => {
    const { dispatch } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'locale',
        value,
      },
    })
  }

  render() {
    const {
      isSidebarOpen,
      isMenuCollapsed,
      isMenuShadow,
      isMenuUnfixed,
      menuLayoutType,
      menuColor,
      systemLayoutColor,
      isTopbarFixed,
      isContentNoMaxWidth,
      isAppMaxWidth,
      isGrayBackground,
      isGrayTopbar,
      isCardShadow,
      isSquaredBorders,
      isBorderless,
      routerAnimation,
      locale,
      theme,
    } = this.props

    const { defaultColor, primaryColor } = this.state

    const ColorPicker = props => {
      return props.colors.map(item => {
        return (
          <a
            href="#"
            key={item}
            onClick={e => this.colorPickerHandler(e, props.setting, item)}
            className={classNames(`${style.cui__sidebar__select__item}`, {
              [style.cui__sidebar__select__item__active]: props.value === item,
              [style.cui__sidebar__select__item__black]: item === 'dark',
              [style.cui__sidebar__select__item__white]: item === 'white',
              [style.cui__sidebar__select__item__gray]: item === 'gray',
              [style.cui__sidebar__select__item__blue]: item === 'blue',
              [style.cui__sidebar__select__item__img]: item === 'image',
            })}
          />
        )
      })
    }

    return (
      <div>
        <div
          className={classNames(style.cui__sidebar, {
            [style.cui__sidebar__toggled]: isSidebarOpen,
          })}
        >
          <Scrollbars
            autoHide
            renderThumbVertical={({ ...props }) => (
              <div
                {...props}
                style={{
                  width: '5px',
                  borderRadius: 'inherit',
                  backgroundColor: 'rgba(195, 190, 220, 0.4)',
                  left: '1px',
                }}
              />
            )}
          >
            <div className={style.cui__sidebar__inner}>
              <a
                href="#"
                className={`fe fe-x-circle ${style.cui__sidebar__close}`}
                onClick={this.toggleSettings}
              />
              <h5>
                <strong>Theme Settings</strong>
              </h5>
              <div className="cui__utils__line" style={{ marginTop: 25, marginBottom: 30 }} />
              <div>
                <div className={style.cui__sidebar__type}>
                  <div className={style.cui__sidebar__type__title}>
                    <span>Menu Layout</span>
                  </div>
                  <div className={style.cui__sidebar__type__items}>
                    <Radio.Group onChange={this.selectMenuLayoutType} defaultValue={menuLayoutType}>
                      <div className="row">
                        <div className="col-6">
                          <div className="mb-2">
                            <Radio value="left">Left Menu</Radio>
                          </div>
                          <div className="mb-2">
                            <Radio value="nomenu">No menu</Radio>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-2">
                            <Radio value="top">Top Menu</Radio>
                          </div>
                        </div>
                      </div>
                    </Radio.Group>
                  </div>
                </div>
                <div className={`${style.cui__sidebar__type} mb-4`}>
                  <div className={style.cui__sidebar__type__title}>
                    <span>Router Animation</span>
                  </div>
                  <div className={style.cui__sidebar__type__items}>
                    <Select
                      defaultValue={routerAnimation}
                      style={{ width: '100%' }}
                      onChange={this.selectRouterAnimation}
                    >
                      <Select.Option value="none">None</Select.Option>
                      <Select.Option value="slide-fadein-up">Slide Up</Select.Option>
                      <Select.Option value="slide-fadein-right">Slide Right</Select.Option>
                      <Select.Option value="fadein">Fade In</Select.Option>
                      <Select.Option value="zoom-fadein">Zoom</Select.Option>
                    </Select>
                  </div>
                </div>
                <div className={`${style.cui__sidebar__type} mb-4`}>
                  <div className={style.cui__sidebar__type__title}>
                    <span>Internationalization</span>
                  </div>
                  <div className={style.cui__sidebar__type__items}>
                    <Select
                      defaultValue={locale}
                      style={{ width: '100%' }}
                      onChange={this.selectLocale}
                    >
                      <Select.Option value="en-US">English (en-US)</Select.Option>
                      <Select.Option value="fr-FR">French (fr-FR)</Select.Option>
                      <Select.Option value="ru-RU">Русский (ru-RU)</Select.Option>
                      <Select.Option value="zh-CN">简体中文 (zh-CN)</Select.Option>
                    </Select>
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Collapsed left menu</div>
                  <div className={style.cui__sidebar__container}>
                    <Switch
                      checked={isMenuCollapsed}
                      disabled={menuLayoutType !== 'left'}
                      onChange={value => {
                        this.changeSetting('isMenuCollapsed', value)
                      }}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Unfixed left menu</div>
                  <div className={style.cui__sidebar__container}>
                    <Switch
                      checked={isMenuUnfixed}
                      disabled={menuLayoutType !== 'left'}
                      onChange={value => {
                        this.changeSetting('isMenuUnfixed', value)
                      }}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Fixed topbar</div>
                  <div className={style.cui__sidebar__container}>
                    <Switch
                      checked={isTopbarFixed}
                      onChange={value => {
                        this.changeSetting('isTopbarFixed', value)
                      }}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Menu color</div>
                  <div className={style.cui__sidebar__container}>
                    <ColorPicker
                      setting="menuColor"
                      value={menuColor}
                      colors={['white', 'gray', 'dark']}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Login color</div>
                  <div className={style.cui__sidebar__container}>
                    <ColorPicker
                      setting="systemLayoutColor"
                      value={systemLayoutColor}
                      colors={['white', 'gray', 'blue', 'dark', 'image']}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Content no max-width</div>
                  <div className={style.cui__sidebar__container}>
                    <Switch
                      checked={isContentNoMaxWidth}
                      onChange={value => {
                        this.changeSetting('isContentNoMaxWidth', value)
                      }}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>App max-width</div>
                  <div className={style.cui__sidebar__container}>
                    <Switch
                      checked={isAppMaxWidth}
                      onChange={value => {
                        this.changeSetting('isAppMaxWidth', value)
                      }}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Gray background</div>
                  <div className={style.cui__sidebar__container}>
                    <Switch
                      checked={isGrayBackground}
                      onChange={value => {
                        this.changeSetting('isGrayBackground', value)
                      }}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Gray topbar</div>
                  <div className={style.cui__sidebar__container}>
                    <Switch
                      checked={isGrayTopbar}
                      onChange={value => {
                        this.changeSetting('isGrayTopbar', value)
                      }}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Squared card borders</div>
                  <div className={style.cui__sidebar__container}>
                    <Switch
                      checked={isSquaredBorders}
                      onChange={value => {
                        this.changeSetting('isSquaredBorders', value)
                      }}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Card shadow</div>
                  <div className={style.cui__sidebar__container}>
                    <Switch
                      checked={isCardShadow}
                      onChange={value => {
                        this.changeSetting('isCardShadow', value)
                      }}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Borderless cards</div>
                  <div className={style.cui__sidebar__container}>
                    <Switch
                      checked={isBorderless}
                      onChange={value => {
                        this.changeSetting('isBorderless', value)
                      }}
                    />
                  </div>
                </div>
                <div className={style.cui__sidebar__item}>
                  <div className={style.cui__sidebar__label}>Menu shadow</div>
                  <div className={style.cui__sidebar__container}>
                    <Switch
                      checked={isMenuShadow}
                      onChange={value => {
                        this.changeSetting('isMenuShadow', value)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Scrollbars>
        </div>
        <Tooltip title="Settings" placement="left">
          <a
            onClick={this.toggleSettings}
            style={{ bottom: 'calc(50% + 120px)' }}
            className={style.cui__sidebar__toggleButton}
          >
            <i className="fe fe-settings" />
          </a>
        </Tooltip>
        <Tooltip title="Switch Dark / Light Theme" placement="left">
          <a
            onClick={this.switchDarkTheme}
            style={{ bottom: 'calc(50% + 60px)' }}
            className={style.cui__sidebar__toggleButton}
          >
            {theme === 'light' && <i className="fe fe-moon" />}
            {theme !== 'light' && <i className="fe fe-sun" />}
          </a>
        </Tooltip>
        <Tooltip title="Set Primary Color" placement="left">
          <a
            style={{ bottom: 'calc(50%)' }}
            className={`${style.cui__sidebar__toggleButton} ${style.color} ${
              primaryColor === defaultColor ? style.reset : ''
            }`}
          >
            <button
              type="button"
              tabIndex="0"
              onFocus={e => {
                e.preventDefault()
              }}
              onKeyPress={this.resetColor}
              onClick={this.resetColor}
            >
              <i className="fe fe-x-circle" />
            </button>
            <input
              type="color"
              id="colorPicker"
              onChange={e => this.selectColor(e.target.value)}
              value={primaryColor}
            />
            <i className="fe fe-package" />
          </a>
        </Tooltip>
        <Tooltip title="Documentation" placement="left">
          <a
            href="https://docs.cleanuitemplate.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ bottom: 'calc(50% - 60px)' }}
            className={style.cui__sidebar__toggleButton}
          >
            <i className="fe fe-book-open" />
          </a>
        </Tooltip>
      </div>
    )
  }
}

export default Sidebar
