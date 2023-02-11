import { useState, useEffect } from 'react'
import { signInWithRedirect, getRedirectResult, User } from '@firebase/auth'

import './Admin.css'
import '../Styles.css'
import { getFirebaseAuth, GAProvider } from '../service/firebaseInit'

const Admin = () => {
  const [user, setUser] = useState<User | undefined | null>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const authUser: User | null = getFirebaseAuth().currentUser
    setUser(authUser)
  })

  useEffect(() => {
    setLoading(true)
    getRedirectResult(getFirebaseAuth())
      .then((result) => {
        const user = result?.user
        setUser(user)
        setLoading(false)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.error('ERROR', errorCode, errorMessage)
        const email = error.customData.email
        setError(`User with email ${email} couldn't log in. Error message: ${errorMessage}`)
        setLoading(false)
      })
  }, [getRedirectResult])

  const loginWithGoogle = async () => {
    setLoading(true)
    await signInWithRedirect(getFirebaseAuth(), GAProvider)
    setLoading(false)
  }

  if (loading) {
    return <div>LOADING</div>
  }

  return (
    <div className='Admin'>
      {error && <div>{error}</div>}
      {user ? (
        <div>Hei {user.displayName}</div>
      ) : (
        <div className='Admin'>
          <h1 className='Header'>Login</h1>
          <button className='Login-button' onClick={() => loginWithGoogle()}>Login with Google</button>
        </div>
      )}
    </div>
  )
}

export default Admin
