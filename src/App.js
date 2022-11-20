import { useState } from 'react'
import Answer from './components/Answer'
import './App.css'

const songCount = 12

const App = () => {
  const [songNumber, setSongNumber] = useState(1)

  localStorage.setItem('songCount', songCount)

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

export default App
