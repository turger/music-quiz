import { useState } from 'react'
import './Points.css'

const Points = () => {
  const songCount = localStorage.getItem('songCount')
  const songCountNum = songCount ? parseInt(songCount) : 1

  const storedPoints = localStorage.getItem('pointsArray')
  const storedPointsArray = storedPoints.split(',').map(Number)

  const [pointsArray, setPointsArray] = useState(storedPointsArray || [...Array(songCountNum)].map(() => 0))
  const [points, setPoints] = useState(pointsArray ? pointsArray.reduce((a, b) => Number(a) + Number(b), 0) : 0)

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
    setPoints(pointsArray.reduce((a, b) => Number(a) + Number(b), 0))
  }

  return (
    <div className='Points'>
      <div className='Points-points'>
        {[...Array(songCountNum)].map((e, i) => (
          <div className='Points-row' key={i}>
            <div className='Points-row-num'>{i + 1}.</div>
            <div className='Points-row-artist'>{getArtist(i) || '🤔'}</div>
            {'-'}
            <div className='Points-row-song'>{getSong(i) || '🤷'}</div>
            <div className='Points-row-points'>
              <button onClick={() => handlePoints(i, 0)}>0</button>
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

export default Points
