import React, {useState, useEffect} from 'react'
import {NavigateFunction} from 'react-router-dom'
import {Game, Field, AnswerField} from '../types'
import {getFields} from '../service/firebaseDB'
import './Answer.css'
import {getLocalStorageAnswerItem} from "./utils";

type AnswerProps = {
  songNumber: number
  game: Game
  navigate: NavigateFunction
}

const Answer = ({songNumber, game, navigate}: AnswerProps) => {
  const getAnswersFromLocalStorage = () => {
    const answers = localStorage.getItem(getLocalStorageAnswerItem(game.id, songNumber))

    if (answers) {
      return JSON.parse(answers)
    }
    return []
  }

  const [songCount, setSongCount] = useState<number>(0)
  const [fields, setFields] = useState<Field[]>([])
  const [answers, setAnswers] = useState<AnswerField[]>(getAnswersFromLocalStorage())


  useEffect(() => {
    if (game && game?.songs) {
      setSongCount(game?.songs?.length)
    }
  }, [game])

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
    setAnswers(getAnswersFromLocalStorage())
  }, [songNumber])

  const changeFieldValue = (value: string, fieldId: string) => {
    const updatedAnswer = answers.find((a) => a.fieldId === fieldId) as AnswerField
    if (updatedAnswer) {
      updatedAnswer.value = value
      setAnswers([...answers.filter((a) => a.fieldId !== fieldId), updatedAnswer])
    } else {
      setAnswers([...answers, {fieldId, value}])
    }
  }

  const handleSongChange = (isNext: boolean) => {
    localStorage.setItem(getLocalStorageAnswerItem(game.id, songNumber), JSON.stringify(answers))

    const nextSongNumber = isNext ? songNumber + 1 : songNumber - 1
    navigate(`/${game.id}/answer/${nextSongNumber}`)
    window.scrollTo(0, 0)
  }

  const handleNext = () => {
    handleSongChange(true)
  }

  const handleBack = () => {
    handleSongChange(false)
  }

  const handleReady = () => {
    localStorage.setItem(getLocalStorageAnswerItem(game.id, songNumber), JSON.stringify(answers))
    window.scrollTo(0, 0)
    navigate(`/${game.id}/points`)
  }

  if (!game) {
    return (
      <div className='Answer'>
        No game found
      </div>
    )
  }

  if (!songCount || songCount === 0) {
    return (
      <div className='Answer'>
        No songs found
      </div>
    )
  }

  if (!fields) {
    return (
      <div className='Answer'>
        No fields found
      </div>
    )
  }

  return (
    <div className='Answer'>
      {fields.map(field => {
        const value = answers.find(a => a.fieldId === field.id)?.value || ''
        return (
          <div className='Answer-content' key={`field-${field.id}`}>
            <label htmlFor={field.name}>{field.name}</label>
            <input
              className='Answer-input'
              type='text'
              id={field.name}
              name={field.name}
              value={value}
              onChange={(e) => changeFieldValue(e.target.value, field.id)}
            />
          </div>
        )
      })}
      <div className='Answer-submit-buttons'>
        {songNumber > 1 && (
          <div onClick={handleBack} className='Answer-back'>
            Back
          </div>
        )}
        {songNumber < songCount && (
          <button onClick={handleNext} className='Answer-next'>
            Next
          </button>
        )}
        {songNumber === songCount && (
          <button onClick={handleReady} className='Answer-ready'>
            Ready
          </button>
        )}
      </div>

    </div>
  )
}

export default Answer
