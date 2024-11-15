import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import Answer from './components/Answer'
import {getGameById} from './service/firebaseDB'
import {Game} from './types'
import './App.css'

const App = () => {
  const {gameId: gameIdParam, songId} = useParams()
  const songNumber = songId ? Number(songId) : 1

  const [gameId, setGameId] = useState(gameIdParam || localStorage.getItem('gameId') || '')
  const [game, setGame] = useState<Game>()
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const getAndSetGame = async (gameId: string) => {
    const game = await getGameById(gameId) as Game
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
            <button className='small-button' onClick={(e) => goToGame(e)}>
              Go to game
            </button>
          </div>
          <div className='App-game-new'>
            <button className='small-button' onClick={(e) => createNewGame(e)}>
              Create a new game
            </button>
          </div>
          <div className='App-game-info'>
            <button className='small-button' onClick={(e) => goToInfoPage(e)}>
              Go to info page
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
          <Answer game={game} songNumber={songNumber} navigate={navigate}/>
          <span className='App-exit-game' onClick={(e) => exitGame(e)}>
            (exit game here)
          </span>
        </>
      )}
    </div>
  )
}

export default App
