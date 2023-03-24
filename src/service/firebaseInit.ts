import { initializeApp, getApps, getApp } from '@firebase/app'
import { getDatabase } from '@firebase/database'
import { getAuth, GoogleAuthProvider } from '@firebase/auth'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
}

const getFirebaseApp = () =>
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

const db = getDatabase(getFirebaseApp())

const getFirebaseDB = () => db

const getFirebaseAuth = () => {
  const auth = getAuth(getFirebaseApp())
  auth.useDeviceLanguage()
  return auth
}

const GAProvider = new GoogleAuthProvider()

export { getFirebaseApp, getFirebaseAuth, GAProvider, getFirebaseDB }