import { useState } from 'react'
import PropTypes from 'prop-types'
import Answer from './components/Answer'
import './App.css'

const App = ({ songCount }) => {
  const [songNumber, setSongNumber] = useState(1)
  return (
    <div className='App'>
      <div className='App-header'>Music quiz</div>
      <div className='App-song-number'>Song number {songNumber}</div>
      <div className='App-answer'>
        {<Answer songNumber={songNumber} setSongNumber={setSongNumber} songCount={songCount} />}
      </div>
    </div>
  )
}

App.propTypes = {
  songCount: PropTypes.number
}

export default App
