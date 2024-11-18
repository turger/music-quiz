import { useState, useEffect } from 'react'
import cx from 'classnames'
import ShortUniqueId from 'short-unique-id'
import { signInWithPopup } from '@firebase/auth'
import { getFirebaseAuth, GAProvider } from '../service/firebaseInit'
import { getUserGames, writeGameData } from '../service/firebaseDB'
import Button from '../components/Button'
import GameEditor from './GameEditor'
import { FirebaseUser, Game } from '../types'
import styles from './Admin.module.less'

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
      const uid = new ShortUniqueId({ length: 4, dictionary: 'alpha_upper' })
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
        className={cx(styles.gameItem, modifying && styles.modify)}
        key={game.id}
        onClick={() => !modifying && handleOpenForm(game.id)}
      >
        <div className={styles.itemDetails} onClick={() => modifying && handleCloseForm(game.id)}>
          <div>{game.id}</div>
          <div>{parseDate(game.created)}</div>
          <div className={styles.gameName}>{game.name}</div>
        </div>
        {modifying && userGames && (
          <GameEditor game={userGames.find((ug) => ug.id === game.id) as Game} user={user} />
        )}
        {modifying && <Button onClick={() => handleCloseForm(game.id)} text='Close' />}
      </div>
    )
  }

  if (loading) {
    return <div>LOADING</div>
  }

  return (
    <div className={styles.admin}>
      {user ? (
        <>
          <div className={styles.header}>Howdy {user.displayName}</div>
          <Button onClick={() => createGame()} text='Plan a new game' />
          {userGames &&
            userGames.length > 0 &&
            userGames.sort((a, b) => b.created - a.created).map((game) => gameItem(game))}
        </>
      ) : (
        <div className={styles.admin}>
          <h1 className={styles.header}>Login</h1>
          <Button onClick={() => loginWithGoogle()} text='Login with Google' />
        </div>
      )}
    </div>
  )
}

export default Admin
