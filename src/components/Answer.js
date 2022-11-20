import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import './Answer.css'

const Answer = ({ songNumber, songCount }) => {
  const [artist, setArtist] = useState(localStorage.getItem(`artist-${songNumber}`) || '')
  const [song, setSong] = useState(localStorage.getItem(`song-${songNumber}`) || '')

  useEffect(() => {
    setArtist(localStorage.getItem(`artist-${songNumber}`) || '')
    setSong(localStorage.getItem(`song-${songNumber}`) || '')
  }, [songNumber])

  const navigate = useNavigate()

  const handleSongChange = (isNext) => {
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

  return (
    <div className='Answer'>
      <div className='Answer-artist'>
        <h1 htmlFor='artist'>Artist</h1>
        <input
          className='Answer-input'
          type='text'
          id='artist'
          name='artist'
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      </div>
      <div className='Answer-song'>
        <h1 htmlFor='artist'>Song name</h1>
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
      {songNumber > 1 && (
        <div onClick={handleBack} className='Answer-back'>
          Back
        </div>
      )}
    </div>
  )
}

Answer.propTypes = {
  songNumber: PropTypes.number,
  songCount: PropTypes.number,
}

export default Answer
