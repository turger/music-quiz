import { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import './Answer.css'

const Answer = ({ songNumber, setSongNumber, songCount }) => {
  const [artist, setArtist] = useState(localStorage.getItem(`artist-${songNumber}`) || '')
  const [song, setSong] = useState(localStorage.getItem(`song-${songNumber}`) || '')

  const navigate = useNavigate()

  const handleNext = () => {
    localStorage.setItem(`artist-${songNumber}`, artist)
    localStorage.setItem(`song-${songNumber}`, song)
    const nextSongNumber = songNumber + 1
    const currentArtist = localStorage.getItem(`artist-${nextSongNumber}`) || ''
    setArtist(currentArtist)
    const currentSong = localStorage.getItem(`song-${nextSongNumber}`) || ''
    setSong(currentSong)
    setSongNumber(nextSongNumber)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    localStorage.setItem(`artist-${songNumber}`, artist)
    localStorage.setItem(`song-${songNumber}`, song)
    const previousSongNumber = songNumber - 1
    const currentArtist = localStorage.getItem(`artist-${previousSongNumber}`) || ''
    setArtist(currentArtist)
    const currentSong = localStorage.getItem(`song-${previousSongNumber}`) || ''
    setSong(currentSong)
    setSongNumber(previousSongNumber)
    window.scrollTo(0, 0)
  }

  const handleReady = () => {
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
  setSongNumber: PropTypes.func,
  songCount: PropTypes.number,
}

export default Answer
