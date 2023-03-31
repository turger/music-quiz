import React, { useState, useEffect } from 'react'
import { NavigateFunction } from 'react-router-dom'
import { Game } from '../types'
import './Answer.css'

type AnswerProps = {
  songNumber: number
  game: Game
  navigate: NavigateFunction
}

const Answer = ({ songNumber, game, navigate }: AnswerProps) => {
  const [artist, setArtist] = useState(localStorage.getItem(`artist-${songNumber}`) || '')
  const [song, setSong] = useState(localStorage.getItem(`song-${songNumber}`) || '')
  const [songCount, setSongCount] = useState<number>(0)

  useEffect(() => {
    if (game && game?.songs) {
      setSongCount(game?.songs?.length)
    }
  }, [game])

  useEffect(() => {
    setArtist(localStorage.getItem(`artist-${songNumber}`) || '')
    setSong(localStorage.getItem(`song-${songNumber}`) || '')
  }, [songNumber])

  const handleSongChange = (isNext: boolean) => {
    localStorage.setItem(`artist-${songNumber}`, artist)
    localStorage.setItem(`song-${songNumber}`, song)
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
    localStorage.setItem(`artist-${songNumber}`, artist)
    localStorage.setItem(`song-${songNumber}`, song)
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

  return (
    <div className='Answer'>
      <div className='Answer-content'>
        <label htmlFor='artist'>Artist</label>
        <input
          className='Answer-input'
          type='text'
          id='artist'
          name='artist'
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      </div>
      <div className='Answer-content'>
        <label htmlFor='song'>Song name</label>
        <input
          className='Answer-input'
          type='text'
          id='song'
          name='song'
          value={song}
          onChange={(e) => setSong(e.target.value)}
        />
      </div>
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
