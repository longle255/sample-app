import { notification } from 'antd'
import { login, currentAccount, logout } from 'services/user'

export function* LOGIN({ payload }, saga) {
    const { email, password } = payload
    const success = yield saga.call(login, email, password)
    if (success) {
        notification.success({
            message: 'Logged In',
            description: 'You have successfully logged in to Clean UI React Admin Template!',
        })
        yield saga.put({
            type: 'LOAD_CURRENT_ACCOUNT',
        })
    }
}

export function* LOAD_CURRENT_ACCOUNT(_, saga) {
    const response = yield saga.call(currentAccount)
    if (response) {
        const { uid: id, displayName: name, email, photoURL: avatar } = response
        yield saga.put({
            type: 'SET_STATE',
            payload: {
                id,
                name,
                email,
                avatar,
                role: 'admin',
                authorized: true,
            },
        })
    }
}

export function* LOGOUT(_, saga) {
    yield saga.call(logout)
    yield saga.put({
      type: 'SET_STATE',
      payload: {
        id: '',
        name: '',
        role: '',
        email: '',
        avatar: '',
        authorized: false,
      },
    })
  }

export default function* rootSaga() {
    yield all([
        fork(LOGIN),
        fork(LOAD_CURRENT_ACCOUNT),
        fork(LOGOUT),
    ]);
}