import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Answer.css'

type AnswerProps = {
  songNumber: number
  gameId: string
}

const Answer = ({ songNumber, gameId }: AnswerProps) => {
  const [artist, setArtist] = useState(localStorage.getItem(`artist-${songNumber}`) || '')
  const [song, setSong] = useState(localStorage.getItem(`song-${songNumber}`) || '')
  const [songCount, setSongCount] = useState(0)
  const [game, setGame] = useState()

  useEffect(() => {
    setArtist(localStorage.getItem(`artist-${songNumber}`) || '')
    setSong(localStorage.getItem(`song-${songNumber}`) || '')


  }, [songNumber])

  const navigate = useNavigate()

  const handleSongChange = (isNext: boolean) => {
    localStorage.setItem(`artist-${songNumber}`, artist)
    localStorage.setItem(`song-${songNumber}`, song)
    const nextSongNumber = isNext ? songNumber + 1 : songNumber - 1
    navigate(`/answer/${nextSongNumber}`)
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
    navigate('/points')
  }

  if (!songCount && !game) {
    return (
      <div className='Answer'>
        No game found
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
