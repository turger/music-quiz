import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import Answer from './components/Answer'
import './App.css'

const App = ({ songCount }) => {
  const { id } = useParams()
  const songNumber = Number(id)

  return (
    <div className='App'>
      <h1 className='App-header'>Music Quiz</h1>
      <div className='App-song-number'>
        <h1 className='App-song-number-text'>{songNumber}.</h1>
      </div>
      <Answer songNumber={songNumber} songCount={songCount} />
    </div>
  )
}

App.propTypes = {
  songCount: PropTypes.number,
}

export default App
