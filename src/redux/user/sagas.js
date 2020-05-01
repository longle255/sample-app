import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { history, store as reduxStore } from 'index'
import { fbLogin, fbCurrentAccount, fbLogout } from 'services/firebase.auth'
import { jwtLogin, jwtCurrentAccount, jwtLogout } from 'services/jwt.auth'
import actions from './actions'

export function* LOGIN({ payload }) {
  const { email, password } = payload
  const provider = reduxStore.getState().settings.authProvider
  const login = provider === 'firebase' ? fbLogin : jwtLogin
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const success = yield call(login, email, password)
  yield put({
    type: 'user/LOAD_CURRENT_ACCOUNT',
  })
  if (success) {
    yield history.push('/')
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in to Clean UI Pro React Admin Template!',
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  const provider = reduxStore.getState().settings.authProvider
  const currentAccount = provider === 'firebase' ? fbCurrentAccount : jwtCurrentAccount
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(currentAccount)
  if (response) {
    const { uid: id, email, photoURL: avatar } = response
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id,
        name: 'Administrator',
        email,
        avatar,
        role: 'admin',
        authorized: true,
      },
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  const provider = reduxStore.getState().settings.authProvider
  const logout = provider === 'firebase' ? fbLogout : jwtLogout
  yield call(logout)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      id: '',
      name: '',
      role: '',
      email: '',
      avatar: '',
      authorized: false,
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
