import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Answer from './components/Answer'
import { getGameById } from './service/firebaseDB'
import { Game } from './types'
import './App.css'

const App = () => {
  const { gameId: gameIdParam, songId } = useParams()
  const songNumber = songId ? Number(songId) : 1

  const [gameId, setGameId] = useState(gameIdParam || localStorage.getItem('gameId') || '')
  const [game, setGame] = useState<Game>()
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const getAndSetGame = async (gameId: string) => {
    const game = await getGameById(gameId) as Game
    if (game) {
      setGame(game)
      navigate(`/${game.id}/answer/${songNumber}`, { replace: true })
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

  const exitGame = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    localStorage.setItem('gameId', '')
    setGameId('')
    setGame(undefined)
    navigate('/', { replace: true })
  }

  const createNewGame = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    window.scrollTo(0, 0)
    navigate(`/admin`, { replace: true })
  }

  return (
    <div className='App'>
      <h1 className='App-header'>Music Quiz</h1>
      {!game && (
        <div className='App-game'>
          <div className='App-game-existing'>
            <label>
              <input
                type='text'
                name='artist'
                value={gameId}
                onChange={(e) => {
                  setGameId(e.target.value.toUpperCase())
                  setError('')
                }}
              />
            </label>
            <button onClick={(e) => goToGame(e)}>
              Go to game
            </button>
          </div>
          <div className='App-game-new'>
            <button onClick={(e) => createNewGame(e)}>
              Create a new game
            </button>
          </div>
        </div>
      )}
      {error && <div>{error}</div>}
      {game && (
        <>
          <div className='App-song-number'>
            <h1 className='App-song-number-text'>{songNumber}.</h1>
          </div>
          <Answer game={game} songNumber={songNumber} navigate={navigate} />
          <button onClick={(e) => exitGame(e)}>
            Exit game
          </button>
        </>
      )}
    </div>
  )
}

export default App
