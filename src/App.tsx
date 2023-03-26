import React from 'react'
import { useParams } from 'react-router-dom'
import Answer from './components/Answer'
import './App.css'

type AppProps = {
  gameId: string
}

const App = ({ gameId }: AppProps) => {
  const { id } = useParams()
  const songNumber = Number(id)

  return (
    <div className='App'>
      <h1 className='App-header'>Music Quiz</h1>
      <div className='App-song-number'>
        <h1 className='App-song-number-text'>{songNumber}.</h1>
      </div>
      <Answer songNumber={songNumber} gameId={gameId} />
    </div>
  )
}

export default App
