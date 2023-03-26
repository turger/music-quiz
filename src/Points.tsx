import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { getGameById } from './service/firebaseDB'
import { Game } from './types'
import './Points.css'

const Points = () => {
  const { gameId: gameIdParam } = useParams()
  const gameId = gameIdParam || localStorage.getItem('gameId') || ''

  const [game, setGame] = useState<Game>()
  const [songCount, setSongCount] = useState<number>(0)

  const getAndSetGame = async (gameId: string) => {
    const game = await getGameById(gameId) as Game
    if (game) {
      setGame(game)
    }
    return game
  }

  useEffect(() => {
    getAndSetGame(gameId)
  }, [])

  useEffect(() => {
    if (game && game?.songs) {
      setSongCount(game?.songs?.length)
    }
  }, [game])

  const storedPoints = localStorage.getItem('pointsArray')
  const initialPointsArray = [...Array(songCount)].map(() => 0)
  const storedPointsArray = storedPoints ? storedPoints.split(',').map(Number) : initialPointsArray

  const calculatePoints = () =>
    pointsArray ? pointsArray.reduce((a, b) => Number(a) + Number(b), 0) : 0

  const [pointsArray, setPointsArray] = useState(storedPointsArray || initialPointsArray)
  const [points, setPoints] = useState(calculatePoints())

  const getArtist = (i: number) => {
    return localStorage.getItem(`artist-${i}`) || ''
  }

  const getSong = (i: number) => {
    return localStorage.getItem(`song-${i}`) || ''
  }

  const handlePoints = (i: number, amount: number) => {
    const updatedPointsArray = pointsArray
    updatedPointsArray[i] = amount
    setPointsArray(updatedPointsArray)
    localStorage.setItem('pointsArray', updatedPointsArray.toString())
    setPoints(calculatePoints())
  }

  return (
    <div className='Points'>
      <h1 className='Points-header'>Score</h1>
      <div className='Points-points'>
        {[...Array(songCount)].map((e, i) => (
          <div className='Points-row' key={i}>
            <div className='Points-row-answer'>
              <p>{`${i + 1}. ${getArtist(i + 1) || '🤔'} –`}</p>
              &nbsp;
              <p>{getSong(i + 1) || '🤷'}</p>
            </div>
            <div className='Points-row-points'>
              {[...Array(3)].map((e, amount) => (
                <div
                  className={cx('Points-row-points-button', {
                    selected: pointsArray[i] === amount,
                  })}
                  key={amount}
                  onClick={() => handlePoints(i, amount)}
                >
                  <p>{amount}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <h3 className='Points-total'>Total points {points} / {songCount * 2}</h3>
    </div>
  )
}

export default Points
