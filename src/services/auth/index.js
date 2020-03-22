import { FB_login, FB_currentAccount, FB_logout } from './providers/firebase'
import { JWT_login, JWT_currentAccount, JWT_logout } from './providers/jwt'

export function auth(provider) {
  switch (provider) {
    case 'firebase':
      return {
        login: (email, password) => {
          return FB_login(email, password)
        },
        currentAccount: () => {
          return FB_currentAccount()
        },
        logout: () => {
          return FB_logout()
        },
      }
    case 'jwt':
      return {
        login: (email, password) => {
          return JWT_login(email, password)
        },
        currentAccount: () => {
          return JWT_currentAccount()
        },
        logout: () => {
          return JWT_logout()
        },
      }
    default:
      return null
  }
}
