import { useState, useEffect } from 'react'
import cx from 'classnames'
import ShortUniqueId from 'short-unique-id'
import { signInWithRedirect, getRedirectResult, User } from '@firebase/auth'
import { getFirebaseAuth, GAProvider } from '../service/firebaseInit'
import { getUserGames, writeGameData } from '../service/firebaseDB'
import { FirebaseUser, Game } from '../types'

import './Admin.css'
import '../Styles.css'
import GameEditor from './GameEditor'

const Admin = () => {
  const [user, setUser] = useState<FirebaseUser>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [modify, setModify] = useState<string[]>([])
  const [userGames, setUserGames] = useState<Game[] | undefined>([])

  useEffect(() => {
    const authUser: FirebaseUser = getFirebaseAuth().currentUser
    setUser(authUser)
  })

  const fetchGames = async () => {
    if(user) {
      const userGames = await getUserGames(user.uid)
      setUserGames(userGames)
    }
  }
  useEffect(() => {
      fetchGames()
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

  const handleOpenForm = (id: string) => {
    setModify([...modify, id])
    console.log("AVATYTYU")
  }

  const handleCloseForm = (id: string) => {
    setModify(modify.filter((nextId) => nextId !== id))
  }

  const createGame = async () => {
    if (user) {
      const gameuUid = new ShortUniqueId({ length: 4, dictionary: 'alpha_upper' })
      const newGameUuid = gameuUid()
      writeGameData(newGameUuid, user?.uid)
      await fetchGames()
      handleOpenForm(newGameUuid)
    }
  }

  const gameItem = (game: Game) => {
    if (!userGames) {
      return null
    }

    const modifying = modify.includes(game.id)

    return (
      <div
        className={cx('game-item', { 'game-modify': modifying })}
        key={game.id}
        onClick={() => !modifying && handleOpenForm(game.id)}
      >
        <div className='game-item-details' onClick={() => modifying && handleCloseForm(game.id)}>
          <p>{parseDate(game.created)}</p>
          <p>{game.name}</p>
        </div>
        {modifying && userGames && (
          <GameEditor game={userGames.find((ug) => ug.id === game.id) as Game} user={user} />
        )}
        {modifying && (
          <button className='small-button' onClick={() => handleCloseForm(game.id)}>
            Close
          </button>
        )}
      </div>
    )
  }

  if (loading) {
    return <div>LOADING</div>
  }

  return (
    <div className='admin'>
      {error && <div>{error}</div>}
      {user ? (
        <>
          <div className='header'>Howdy {user.displayName}</div>
          <button onClick={() => createGame()} className='new-game'>
            Plan a new game
          </button>
          {userGames && userGames.length > 0 && userGames.sort((a,b) => b.created - a.created).map((game) => gameItem(game))}
        </>
      ) : (
        <div className='admin'>
          <h1 className='header'>Login</h1>
          <button className='login-button' onClick={() => loginWithGoogle()}>
            Login with Google
          </button>
        </div>
      )}
    </div>
  )
}

export default Admin
