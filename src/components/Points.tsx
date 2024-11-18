import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { getFields, getGameById } from '../service/firebaseDB'
import { AnswerField, Field, Game } from '../types'
import { getLocalStorageAnswerItem } from './utils'
import styles from './Points.module.less'

const Points = () => {
  const { gameId: gameIdParam } = useParams()
  const gameId = gameIdParam || localStorage.getItem('gameId') || ''
  const localStoragePointsItem = `pointsArray-${gameId}`

  const storedPointsFromStorage = localStorage.getItem(localStoragePointsItem)
  const initialPoints = {}
  const storedPoints = storedPointsFromStorage ? JSON.parse(storedPointsFromStorage) : initialPoints

  const [game, setGame] = useState<Game>()
  const [songCount, setSongCount] = useState<number>(0)
  const [fields, setFields] = useState<Field[]>([])
  const [pointsArray, setPointsArray] = useState<{ [key: number]: number | undefined }>(
    storedPoints || initialPoints,
  )

  const getAndSetGame = async (gameId: string) => {
    const game = (await getGameById(gameId)) as Game
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

  const calculatePoints = (): number | undefined =>
    pointsArray
      ? Object.values(pointsArray)
          .filter((points) => points)
          .reduce((prev, current) => Number(prev) + Number(current), 0)
      : 0

  const getAnswers = (i: number) => {
    const answers = localStorage.getItem(getLocalStorageAnswerItem(gameId, i))

    if (answers) {
      const parsedAnswers: AnswerField[] = JSON.parse(answers)

      return fields.map((f) => {
        const answr = parsedAnswers.find((a) => a.fieldId === f.id)
        const value = answr?.value
        return value || '🤔'
      })
    }

    return []
  }

  const handlePoints = (i: number, amount: number) => {
    const newAmount = pointsArray[i] === amount ? undefined : amount
    const updatedPointsArray = { ...pointsArray, ...{ [i]: newAmount } }

    setPointsArray(updatedPointsArray)
    localStorage.setItem(localStoragePointsItem, JSON.stringify(updatedPointsArray))
  }

  const maxPoints = fields.length || 3

  return (
    <div className={styles.points}>
      <h1>Score</h1>
      <p>{fields.map((field, i) => `${field.name} ${i + 1 !== fields.length ? ' – ' : ''}`)}</p>
      <div>
        {[...Array(songCount)].map((e, i) => {
          const answers: string[] = getAnswers(i + 1)
          return (
            <div className={styles.row} key={`row-${i}`}>
              <div className={styles.answer}>
                {i + 1}.&nbsp;
                {answers.map((a, j) => (
                  <p key={`row-points-${a}-${j}`}>
                    {a}&nbsp;{j + 1 !== answers.length ? '–' : ''}&nbsp;
                  </p>
                ))}
              </div>
              <div className={styles.rowPoints}>
                {[...Array(maxPoints + 1 || 3)].map((e, pointsAmount) => (
                  <div
                    key={`row-points-${pointsAmount}-${answers}`}
                    className={cx(
                      styles.pointsButton,
                      pointsArray[i] === pointsAmount && styles.selected,
                    )}
                    onClick={() => handlePoints(i, pointsAmount)}
                  >
                    <p>{pointsAmount}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <h3>
        Total points {calculatePoints()} / {songCount * maxPoints}
      </h3>
    </div>
  )
}

export default Points
