import { useState } from 'react'
import PropTypes from 'prop-types'
import './Answer.css'

const Answer = ({ songNumber, setSongNumber, songCount }) => {
  const [artist, setArtist] = useState(localStorage.getItem(`artist-${songNumber}`) || '')
  const [song, setSong] = useState(localStorage.getItem(`song-${songNumber}`) || '')

  const handleNext = () => {
    localStorage.setItem(`artist-${songNumber}`, artist)
    localStorage.setItem(`song-${songNumber}`, song)
    const nextSongNumber = songNumber + 1
    const currentArtist = localStorage.getItem(`artist-${nextSongNumber}`) || ''
    setArtist(currentArtist)
    const currentSong = localStorage.getItem(`song-${nextSongNumber}`) || ''
    setSong(currentSong)
    setSongNumber(nextSongNumber)
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
  }

  const handleReady = () => {
    // TODO points counting
  }

  return (
    <div className='Answer'>
      {songNumber}
      <div className='Answer-artist'>
        <label htmlFor='artist'>Artist</label>
        <input
          type='text'
          id='artist'
          name='artist'
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
      </div>
      <div className='Answer-song'>
        <label htmlFor='song'>Song name</label>
        <input
          type='text'
          id='song'
          name='song'
          value={song}
          onChange={(e) => setSong(e.target.value)}
        />
      </div>
      {songNumber > 1 && <button onClick={handleBack} className='Answer-back'>Back</button>}
      {songNumber < songCount && <button onClick={handleNext} className='Answer-next'>Next</button>}
      {songNumber === songCount && <button onClick={handleReady} className='Answer-ready'>Ready</button>}
    </div>
  )
}

Answer.propTypes = {
  songNumber: PropTypes.number,
  setSongNumber: PropTypes.func,
  songCount: PropTypes.number
}

export default Answer
