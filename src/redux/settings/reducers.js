import store from 'store'
import actions from './actions'

const STORED_SETTINGS = storedSettings => {
  const settings = {}
  Object.keys(storedSettings).forEach(key => {
    const item = store.get(`app.settings.${key}`)
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key]
  })
  return settings
}

const initialState = {
  ...STORED_SETTINGS({
    logo: 'Clean UI',
    locale: 'en-US',
    isSidebarOpen: false,
    isSupportChatOpen: false,
    isMobileView: false,
    isMobileMenuOpen: false,
    isMenuCollapsed: false,
    menuLayoutType: 'left', // left, top, nomenu
    routerAnimation: 'slide-fadein-up', // none, slide-fadein-up, slide-fadein-right, fadein, zoom-fadein
    menuColor: 'white', // white, dark, gray
    theme: 'light', // light, dark
    leftMenuWidth: 256,

    isMenuShadow: false,
    isMenuUnfixed: false,
    isTopbarFixed: false,
    isContentNoMaxWidth: false,
    isAppMaxWidth: false,
    isWhiteBackground: false,
    isGrayTopbar: false,
    isCardShadow: false,
    isSquaredBorders: false,
    isBorderless: false,
    authPagesColor: 'gray', // white, dark, blue, gray, image
  }),
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
