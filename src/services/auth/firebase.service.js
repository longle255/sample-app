import firebase from 'firebase/app'
import { notification } from 'antd'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/functions'

const firebaseConfig = {
  apiKey: 'AIzaSyBJVhr2WZshEGR7egcxoygQIphKOkKVIYQ',
  authDomain: 'sellpixels-7d5d4.firebaseapp.com',
  databaseURL: 'https://sellpixels-7d5d4.firebaseio.com',
  projectId: 'sellpixels-7d5d4',
  storageBucket: 'cleanui-72a42.appspot.com',
  messagingSenderId: '338219933237',
}

export const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebase.auth

export async function login(email, password) {
  return firebaseAuth()
    .signInWithEmailAndPassword(email, password)
    .then(() => true)
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    })
}

export async function register(email, password) {
  return firebaseAuth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => true)
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    })
}

export async function currentAccount() {
  let userLoaded = false
  function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
      if (userLoaded) {
        resolve(firebaseAuth.currentUser)
      }
      const unsubscribe = auth.onAuthStateChanged(user => {
        userLoaded = true
        unsubscribe()
        console.log('user', user)
        resolve(user)
      }, reject)
    })
  }
  return getCurrentUser(firebaseAuth())
}

export async function logout() {
  return firebaseAuth()
    .signOut()
    .then(() => true)
}
