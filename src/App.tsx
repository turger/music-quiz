import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Answer from './components/Answer'
import Button from './components/Button'
import { getGameById } from './service/firebaseDB'
import { Game } from './types'
import styles from './App.module.less'

const App = () => {
  const { gameId: gameIdParam, songId } = useParams()
  const songNumber = songId ? Number(songId) : 1

  const [gameId, setGameId] = useState(gameIdParam || localStorage.getItem('gameId') || '')
  const [game, setGame] = useState<Game>()
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const getAndSetGame = async (gameId: string) => {
    const game = (await getGameById(gameId)) as Game
    if (game) {
      setGame(game)
      navigate(`/${game.id}/answer/${songNumber}`)
    } else if (gameId.length >= 4) {
      setError('Game not found with this id')
    }
  }

  useEffect(() => {
    getAndSetGame(gameId)
  }, [])

  const goToGame = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (gameId) {
      localStorage.setItem('gameId', gameId)
      getAndSetGame(gameId)
    }
  }

  const goToInfoPage = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    navigate('/info')
  }

  const exitGame = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    localStorage.setItem('gameId', '')
    setGameId('')
    setGame(undefined)
    navigate('/')
  }

  const createNewGame = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    window.scrollTo(0, 0)
    navigate(`/admin`)
  }

  return (
    <div className={styles.app}>
      <h1 className={styles.header}>Music Quiz</h1>
      {!game && (
        <div className={styles.game}>
          <div className={styles.existing}>
            <label>
              <input
                className={styles.gameInput}
                type='text'
                name='artist'
                value={gameId}
                onChange={(e) => {
                  setGameId(e.target.value.toUpperCase())
                  setError('')
                }}
              />
            </label>
            <Button onClick={(e) => goToGame(e)} text='Go to game' />
          </div>
          <Button onClick={(e) => createNewGame(e)} text='Game creation' />
          <Button onClick={(e) => goToInfoPage(e)} text='Go to info page' />
        </div>
      )}
      {error && <div>{error}</div>}
      {game && (
        <>
          <div className={styles.songNumber}>
            <h1 className={styles.songNumberText}>{songNumber}.</h1>
          </div>
          <Answer game={game} songNumber={songNumber} navigate={navigate} />
          <span className={styles.exitGame} onClick={(e) => exitGame(e)}>
            (exit game here)
          </span>
        </>
      )}
    </div>
  )
}

export default App
