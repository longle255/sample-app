import store from 'store'

const FAKE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRoZW9ybml0aG9sb2dpc3QiLCJzdXJuYW1lIjoiQm9uZCIsIm5hbWUiOiJKYW1lcyBCb25kIiwiaWF0Ijo5NDY2ODQ4MDB9.uOP6fIf8dhgb7As5D0a4z6EjaXsudQgrKWj8PmoWFd0'
const FAKE_USERS = [
  {
    uid: 36254,
    email: 'admin@mediatec.org',
    avatar: '',
    password: 'cleanui',
  },
]

const fakeFetch = (url, params) => {
  console.log(params)
  switch (url) {
    case 'api/login':
      return new Promise(resolve => {
        resolve({
          headers: '',
          jwt: FAKE_JWT,
          data: FAKE_USERS[0],
        })
      })
    case 'api/currentUser':
      return new Promise(resolve => {
        resolve({
          headers: '',
          jwt: FAKE_JWT,
          data: FAKE_USERS[0],
        })
      })
    case 'api/logout':
      return new Promise(resolve => {
        resolve(true)
      })
    default:
      return null
  }
}

export async function jwtLogin(email, password) {
  const user = {
    email,
    password,
  }
  return (
    // replace this with real fetch() method
    fakeFetch('api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ user }),
    })
      // .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          return false
        }
        store.set('jwt.token', data.jwt)
        return data.data
      })
  )
}

export async function jwtCurrentAccount() {
  const jwt = store.get('jwt.token')
  return (
    // replace this with real fetch() method
    fakeFetch('api/currentUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ jwt }),
    })
      // .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          return false
        }
        return data.data
      })
  )
}

export async function jwtLogout() {
  const jwt = store.get('jwt.token')
  return (
    // replace this with real fetch() method
    fakeFetch('api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ jwt }),
    })
      // .then(resp => resp.json())
      .then(data => {
        if (data.message) {
          return false
        }
        store.remove('jwt.token')
        return true
      })
  )
}
