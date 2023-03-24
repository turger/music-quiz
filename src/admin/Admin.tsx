import { useState, useEffect } from 'react'
import cx from 'classnames'
import { signInWithRedirect, getRedirectResult, User } from '@firebase/auth'
import { getFirebaseAuth, GAProvider } from '../service/firebaseInit'
import { getUserGames, writeGameData } from '../service/firebaseDB'
import { FirebaseUser, UserGame } from '../types'

import './Admin.css'
import '../Styles.css'
import GameEditor from './GameEditor'

const Admin = () => {
  const [user, setUser] = useState<FirebaseUser>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [modify, setModify] = useState<string[]>([])
  const [userGames, setUserGames] = useState<UserGame[] | undefined>([])

  useEffect(() => {
    const authUser: FirebaseUser = getFirebaseAuth().currentUser
    setUser(authUser)
  })

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const userGames = await getUserGames(user.uid)
        setUserGames(userGames)
      }
      fetchData()
    }
  }, [user])

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

  const parseDate = (date: number) => {
    return new Date(date).toLocaleDateString()
  }

  const createGame = () => {
    if (user) {
      writeGameData('XYZI', user?.uid)
    }
  }

  const handleOpenForm = (id: string) => {
    setModify([...modify, id])
  }

  const handleCloseForm = (id: string) => {
    setModify(modify.filter(nextId => nextId !== id))
  }

  const gameItem = (game: UserGame) => {
    const modifying = modify.includes(game.id)

    return (
      <div className={cx('Game-item', { 'Game-modify': modifying })} key={game.id} onClick={() => !modifying && handleOpenForm(game.id)}>
        <div className='Game-item-details'>
          <p>{parseDate(game.created)}</p>
          <p>{game.name}</p>
        </div>
        {modifying && userGames && <GameEditor game={userGames[0]} user={user} />}
        {modifying && <button onClick={() => handleCloseForm(game.id)}>Close</button>}
      </div>
    )
  }

  if (loading) {
    return <div>LOADING</div>
  }

  return (
    <div className='Admin'>
      {error && <div>{error}</div>}
      {user ? (
        <>
          <div className='Header'>Howdy {user.displayName}</div>
          <button onClick={() => createGame()} className='New-game'>Plan a new game</button>
          {userGames && userGames.length > 0 && userGames.map(game => gameItem(game))}
        </>
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
