import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import cx from 'classnames'
import {getFields, getGameById} from '../service/firebaseDB'
import {AnswerField, Field, Game} from '../types'
import {getLocalStorageAnswerItem} from './utils'
import './Points.css'

const Points = () => {
  const {gameId: gameIdParam} = useParams()
  const gameId = gameIdParam || localStorage.getItem('gameId') || ''
  const localStoragePointsItem = `pointsArray-${gameId}`

  const [game, setGame] = useState<Game>()
  const [songCount, setSongCount] = useState<number>(0)
  const [fields, setFields] = useState<Field[]>([])

  const getAndSetGame = async (gameId: string) => {
    const game = await getGameById(gameId) as Game
    if (game) {
      setGame(game)
    }
    return game
  }

  useEffect(() => {
    if (game) {
      const fetchData = async () => {
        const fields = await getFields(game.id)
        if (fields && fields.length > 0) {
          setFields(fields)
        }
      }
      fetchData()
    }
  }, [game])

  useEffect(() => {
    getAndSetGame(gameId)
  }, [])

  useEffect(() => {
    if (game && game?.songs) {
      setSongCount(game?.songs?.length)
    }
  }, [game])

  const storedPoints = localStorage.getItem(localStoragePointsItem)
  const initialPointsArray = [...Array(songCount)].map(() => 0)
  const storedPointsArray = storedPoints ? storedPoints.split(',').map(Number) : initialPointsArray

  const calculatePoints = () =>
    pointsArray ? pointsArray.reduce((a, b) => Number(a) + Number(b), 0) : 0

  const [pointsArray, setPointsArray] = useState(storedPointsArray || initialPointsArray)
  const [points, setPoints] = useState(calculatePoints())

  const getAnswers = (i: number) => {
    const answers = localStorage.getItem(getLocalStorageAnswerItem(gameId, i))

    if (answers) {
      const parsedAnswers: AnswerField[] = JSON.parse(answers)

      return fields.map(f => {
        const answr = parsedAnswers.find((a) => a.fieldId === f.id)
        const value = answr?.value
        return value || '🤔'
      })
    }

    return []
  }

  const handlePoints = (i: number, amount: number) => {
    const updatedPointsArray = pointsArray
    updatedPointsArray[i] = amount
    setPointsArray(updatedPointsArray)
    localStorage.setItem(localStoragePointsItem, updatedPointsArray.toString())
    setPoints(calculatePoints())
  }

  const maxPoints = fields.length || 3

  return (
    <div className='Points'>
      <h1 className='Points-header'>Score</h1>
      <p>{fields.map((field, i) => `${field.name} ${i + 1 !== fields.length ? ' – ' : ''}`)}</p>
      <div className='Points-points'>
        {[...Array(songCount)].map((e, i) => {
          const answers: string[] = getAnswers(i + 1)
          return (
            <div className='Points-row' key={i}>
              <div className='Points-row-answer'>
                {i + 1}.&nbsp;
                {answers.map((a, j) => (<p>{a}&nbsp;{j + 1 !== answers.length ? '–' : ''}&nbsp;</p>))}
              </div>
              <div className='Points-row-points'>
                {[...Array(maxPoints + 1 || 3)].map((e, amount) => (
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
          )
        })}
      </div>
      <h3 className='Points-total'>Total points {points} / {songCount * maxPoints}</h3>
    </div>
  )
}

export default Points
