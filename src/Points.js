import { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import './Points.css'

const Points = ({ songCount }) => {
  const storedPoints = localStorage.getItem('pointsArray')
  const initialPointsArray = [...Array(songCount)].map(() => 0)
  const storedPointsArray = storedPoints ? storedPoints.split(',').map(Number) : initialPointsArray

  const calculatePoints = () =>
    pointsArray ? pointsArray.reduce((a, b) => Number(a) + Number(b), 0) : 0

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
      <h1 className='Points-header'>Score</h1>
      <div className='Points-points'>
        {[...Array(songCount)].map((e, i) => (
          <div className='Points-row' key={i}>
            <div className='Points-row-answer'>
              <div>{i + 1}. {getArtist(i) || '🤔'} -</div>
              <div>{getSong(i) || '🤷'}</div>
            </div>
            <div className='Points-row-points'>
              {[...Array(3)].map((e, amount) => (
                <div
                  className={cx('Points-row-points-button', {
                    selected: pointsArray[i] === amount,
                  })}
                  key={amount}
                  onClick={() => handlePoints(i, amount)}
                >
                  {amount}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <h3 className='Points-total'>Total points: {points}</h3>
    </div>
  )
}

Points.propTypes = {
  songCount: PropTypes.number,
}

export default Points
