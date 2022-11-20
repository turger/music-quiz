import { useState } from 'react'
import PropTypes from 'prop-types'
import './Points.css'

const Points = ({ songCount }) => {
  const storedPoints = localStorage.getItem('pointsArray')
  const initialPointsArray = [...Array(songCount)].map(() => 0)
  const storedPointsArray = storedPoints ? storedPoints.split(',').map(Number) : initialPointsArray

  const calculatePoints = () => pointsArray ? pointsArray.reduce((a, b) => Number(a) + Number(b), 0) : 0

  const [pointsArray, setPointsArray] = useState(storedPointsArray || initialPointsArray)
  const [points, setPoints] = useState(calculatePoints())

  const getArtist = (i) => {
    return localStorage.getItem(`artist-${i}`) || ''
  }

  const getSong = (i) => {
    return localStorage.getItem(`song-${i}`) || ''
  }

  const handlePoints = (i, amount) => {
    const updatedPointsArray = pointsArray
    updatedPointsArray[i] = amount
    setPointsArray(updatedPointsArray)
    localStorage.setItem('pointsArray', updatedPointsArray)
    setPoints(calculatePoints())
  }

  return (
    <div className='Points'>
      <div className='Points-points'>
        {[...Array(songCount)].map((e, i) => (
          <div className='Points-row' key={i}>
            <div className='Points-row-num'>{i + 1}.</div>
            <div className='Points-row-artist'>{getArtist(i) || '🤔'}</div>
            {'-'}
            <div className='Points-row-song'>{getSong(i) || '🤷'}</div>
            <div className='Points-row-points'>
              <button className='' onClick={() => handlePoints(i, 0)}>0</button>
              <button onClick={() => handlePoints(i, 1)}>1</button>
              <button onClick={() => handlePoints(i, 2)}>2</button>
              <div className='Points-row-points-selected'>{pointsArray[i]}</div>
            </div>
          </div>
        ))}
      </div>
      <div className='Points-total'>Total points: {points}</div>
    </div>
  )
}

Points.propTypes = {
  songCount: PropTypes.number,
}

export default Points
