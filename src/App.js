import { useState } from 'react'
import PropTypes from 'prop-types'
import Answer from './components/Answer'
import './App.css'

const App = ({ songCount }) => {
  const [songNumber, setSongNumber] = useState(1)
  return (
    <div className='App'>
      <h1 className='App-header'>Music Quiz</h1>
      <div className='App-song-number'>
        <h1 className='App-song-number-text'>{songNumber}.</h1>
      </div>
      <Answer songNumber={songNumber} setSongNumber={setSongNumber} songCount={songCount} />
    </div>
  )
}

App.propTypes = {
  songCount: PropTypes.number,
}

export default App
