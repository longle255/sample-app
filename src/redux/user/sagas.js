import { all, takeEvery, put } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from 'index'
import actions from './actions'
// import { authLogin, authGetUserData, authLogout } from 'services/auth.service'

export function* LOGIN({ payload }) {
  const { email, password } = payload
  console.log('login', `${email}:${password}`)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  // replace "success" with login api endpoint call, example: const success = yield call(authLogin, email, password)
  const success = true
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
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  // replace "response" with get user data api endpoint call, example: const response = yield call(authGetUserData)
  const response = {
    id: 1,
    name: 'Administrator',
    email: 'hello@mediatec.org',
    role: 'admin',
  }
  if (response) {
    const { id, name, email, role } = response
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id,
        name,
        email,
        role,
        avatar: '',
        authorized: true, // set app to authorized state
        loading: false,
      },
    })
  }
}

export function* LOGOUT() {
  // uncomment next line for call logout api endpoint
  // yield call(authLogout)
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
