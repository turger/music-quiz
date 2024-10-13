import {useState, useEffect} from 'react'
import cx from 'classnames'
import ShortUniqueId from 'short-unique-id'
import {signInWithPopup} from '@firebase/auth'
import {getFirebaseAuth, GAProvider} from '../service/firebaseInit'
import {getUserGames, writeGameData} from '../service/firebaseDB'
import {FirebaseUser, Game} from '../types'

import './Admin.css'
import '../Styles.css'
import GameEditor from './GameEditor'

const Admin = () => {
  const [user, setUser] = useState<FirebaseUser>(null)
  const [loading, setLoading] = useState(false)
  const [modify, setModify] = useState<string[]>([])
  const [userGames, setUserGames] = useState<Game[] | undefined>([])

  useEffect(() => {
    const auth = getFirebaseAuth()

    const checkAuthState = async () => {
      await auth.authStateReady()
      if (auth.currentUser) {
        setUser(auth.currentUser)
      }
    }

    checkAuthState()
  }, [])

  const fetchGames = async () => {
    if (user) {
      const userGames = await getUserGames(user.uid)
      setUserGames(userGames)
    }
  }
  useEffect(() => {
    fetchGames()
  }, [user])

  const loginWithGoogle = async () => {
    setLoading(true)
    const userCred = await signInWithPopup(getFirebaseAuth(), GAProvider)
    setUser(userCred?.user)
    setLoading(false)
  }

  const parseDate = (date: number) => {
    return new Date(date).toLocaleDateString()
  }

  const handleOpenForm = (id: string) => {
    setModify([...modify, id])
  }

  const handleCloseForm = (id: string) => {
    setModify(modify.filter((nextId) => nextId !== id))
  }

  const createGame = async () => {
    if (user) {
      const uid = new ShortUniqueId({length: 4, dictionary: 'alpha_upper'})
      const newGameUuid = uid.rnd()
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
        className={cx('game-item', {'game-modify': modifying})}
        key={game.id}
        onClick={() => !modifying && handleOpenForm(game.id)}
      >
        <div className='game-item-details' onClick={() => modifying && handleCloseForm(game.id)}>
          <p>{game.id}</p>
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
      {user ? (
        <>
          <div className='header'>Howdy {user.displayName}</div>
          <button onClick={() => createGame()} className='new-game'>
            Plan a new game
          </button>
          {userGames && userGames.length > 0 && userGames.sort((a, b) => b.created - a.created).map((game) => gameItem(game))}
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
